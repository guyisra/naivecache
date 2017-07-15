const NaiveCacher = require('./index.js')

const contentFetcher = () => Promise.resolve('This is fresh content!!')

const options = {
  ttl: 24 * 60 * 60
}
describe('get', () => {
  describe('when content is cached', () => {
    it('returns the cache', async () => {
      const cache = new NaiveCacher(contentFetcher, options)
      cache.set('data')
      const cached = await cache.get()
      expect(cached).toBe('data')
    })
  })

  describe('when multiple gets', () => {
    it('calls the fetcher only once', async () => {
      const mockFetcher = jest.fn(() => Promise.resolve())

      const cache = new NaiveCacher(mockFetcher, options)

      const prom1 = cache.get()
      const prom2 = cache.get()

      await Promise.all([prom1, prom2])

      expect(mockFetcher).toHaveBeenCalledTimes(1)
    })
  })

  describe('when content is fresh', () => {
    it('returns the fetched content', async () => {
      const cache = new NaiveCacher(contentFetcher, options)

      const cached = await cache.get()

      expect(cached).toBe('This is fresh content!!')
    })

    it('caches the new content', async () => {
      const cache = new NaiveCacher(contentFetcher, options)
      cache.set = jest.fn()
      await cache.get()

      expect(cache.set).toBeCalled()
    })
  })

  describe('when content is stale', () => {
    it('returns the fetched content', async () => {
      const cache = new NaiveCacher(contentFetcher, { ttl: -1 }) // -1 is used to get instant staleness
      cache.set('some stale content')

      const cached = await cache.get()

      expect(cached).toBe('This is fresh content!!')
    })

    it('caches the new content', async () => {
      const cache = new NaiveCacher(contentFetcher, { ttl: 0 })
      cache.set = jest.fn()
      await cache.get()

      expect(cache.set).toBeCalled()
    })
  })
})