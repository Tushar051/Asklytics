require('./proxy-polyfill.js')
var shallowCopy = require('shallow-copy')
var hasOwnProperty = Object.prototype.hasOwnProperty

module.exports = function(logger) {
  logger = logger || console
  var factories = {}
  var proxyMightHaveFrozenFactoriesObject = false

  return function() {
    validateArguments(arguments)

    if (arguments.length === 2) {
      if (proxyMightHaveFrozenFactoriesObject) {
        throw new Error("Poppins: You can't register a new module now because some modules have already been built.")
      }
      registerModule.apply(null, arguments)
    } else {
      return buildDependencyProvider(arguments[0])
    }
  }

  function registerModule (name, factory) {
    factories[name] = factory
  }

  function buildDependencyProvider (overrides) {
    validateOverrides(overrides)
    var cache = shallowCopy(overrides) || {}
    var requireStack = []

    var provider = new Proxy(factories, {
      get: function (factories, name) {
        if (requireStack.indexOf(name) > -1) {
          throw new Error('Poppins: Could not build ' + name + ' because there is a dependency cycle: ' + requireStack.join(' -> ') + ' -> ' + name)
        }

        requireStack.push(name)

        if (!hasOwnProperty.call(cache, name)) {
          cache[name] = buildModule(name, provider)
        }

        requireStack.pop()

        return cache[name]
      }
    })

    proxyMightHaveFrozenFactoriesObject = true

    return provider
  }

  function buildModule(name, provider) {
    if (!hasOwnProperty.call(factories, name)) {
      throw new Error('Poppins: No factory registered for requested module "' + name + '"')
    }
    return factories[name](provider)
  }

  function validateOverrides(overrides) {
    if (!overrides) return

    for (var key in overrides) {
      if (hasOwnProperty.call(overrides, key) && !hasOwnProperty.call(factories, key)) {
        throw new Error("Poppins: You're trying to override " + key + ", but there is no such module.")
      }
    }
  }
}

function validateArguments(args) {
  var message = 'Poppins was called with unexpected arguments. You may want to have a look at the docs: https://github.com/benchristel/poppins/'

  if (args.length === 1) {
    if (typeof args[0] !== 'object') {
      throw Error(message)
    }
  } else if (args.length === 2) {
    if (typeof args[0] !== 'string' || typeof args[1] !== 'function') {
      throw Error(message)
    }
  } else if (args.length > 2) {
    throw Error(message)
  }
}
