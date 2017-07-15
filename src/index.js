/*
 * fetcher - a promise-returning function, to be called when the data is not in the cache or stale
 * options - 
 *  - ttl - Time To Live, time in seconds to expire the content
*/
class NaiveCacher {
  constructor(fetcher, options = {}) {
    this.ttl = options.ttl || 24 * 60 * 60
    this.fetcher = fetcher
    this.cache = {
      savedAt: timeNowInSeconds(),
      content: null
    }
  }

  get() {
    if (this.isCached()) {
      return Promise.resolve(this.cache.content)
    }

    // When a promise is already being excuted, but waiting to be fulfilled, a new call to get(), shouldn't
    // trigger a new execution of the promise, so it just returns that promise
    if (this.fetchingPromise) {
      return this.fetchingPromise
    }

    this.fetchingPromise = this.fetcher()
    return this.fetchingPromise.then(newContent => {
      this.set(newContent)
      this.fetchingPromise = undefined
      return newContent
    })
  }

  set(data) {
    this.cache.savedAt = timeNowInSeconds()
    this.cache.content = data
  }

  isExpired() {
    return timeNowInSeconds() - this.cache.savedAt < this.ttl
  }

  isCached() {
    return this.cache.content !== null && this.isExpired()
  }
}

const timeNowInSeconds = () => new Date().getTime() / 1000

module.exports = NaiveCacher