# NaïveCache


An extremely simple and naive cache of stuff.


## Quickstart

```
$ yarn add naivecache
```

# Usage

Decide what you want to cache, and how to handle misses

```
const myCache = new NaiveCacher( () =>
  Promise.resolve("this is what you've been missing",
  { ttl: 86400 }
)
```

in this cases, `handleMisses` can be anything from network calls, disk calls or some other complex calculation calls

Then all you need to do is

```
myCache.get().then(result => console.log(result))
```

This will fetch the value and store it.

If you need to set the cache initially, just use `myCache.set(val)`

# Contributing

Fork, implement, add tests, pull request, get my everlasting thanks and a respectable place here :).

# Copyright

Copyright (c) 2017 [Guy Israeli] [@isguyra](http://twitter.com/isguyra). See [LICENSE](LICENSE) for further details.