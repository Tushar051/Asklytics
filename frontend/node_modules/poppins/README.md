# poppins

ES6-optimized dependency injection

## How?

### Create a dependency container

```javascript
const Poppins = require('poppins')
const inject = Poppins()
```

### Register a factory function

Here, our factory is named `kite` and requires `paper` and `string` as dependencies

```javascript
inject('kite', ({paper, string}) => {
  if (paper && string) {
    return 'a kite!'
  } else {
    return 'no kite :('
  }
})

inject('paper', () => true)
inject('string', () => true)
```

### Get your stuff, with dependencies injected

```javascript
let {kite} = inject()
expect(kite).toEqual('a kite!')
```

### Override dependencies with test doubles

```javascript
let {kite} = inject({paper: false})
expect(kite).toEqual('no kite :(')
```

## Caveats

### The Module Cache

Each time you retrieve modules with `let {foo, bar} = inject()`, your factory functions are invoked to build the dependency tree. Caching is in place so each factory will be called at most once, even if multiple things depend on that module. However, *a new cache is created* for each time you call `inject()`. This allows you to have multiple instances of your app or library running in the same environment, while keeping their state isolated.

This also has benefits for test isolation, as you're guaranteed to get a brand-new object graph in each test if you access your modules using `inject()`.

### ES6 Proxies

Poppins uses ES6 proxies. It comes with a polyfill so you don't need a native Proxy implementation to use it, but you'll get better error messages (for example, if you try to inject a module that doesn't exist) if your environment does have native Proxies.