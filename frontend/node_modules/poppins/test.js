var Poppins = require('./index')

function runningOnCI() {
  return !!process.env.CIRCLE_BUILD_URL
}

describe('Poppins', function() {
  var inject

  beforeEach(function() {
    inject = Poppins()
  })

  //
  // Happy path tests!
  //

  it('registers a module and provides it later', function() {
    inject('foo', function() {
      return 'this is foo'
    })

    var provided = inject()

    expect(provided.foo).toEqual('this is foo')
  })

  it('injects dependencies into each provided module', function() {
    inject('root', function(injected) {
      return 'I depend on ' + injected.unicorns
    })

    inject('unicorns', function() {
      return 'unicorns!'
    })

    var provided = inject()

    expect(provided.root).toEqual('I depend on unicorns!')
  })

  it('calls each factory at most once per inject() call', function() {
    var sideEffects = []

    inject('root', function(injected) {
      sideEffects.push("root")
      return 'I depend on ' + injected.unicorns
    })

    inject('unicorns', function() {
      sideEffects.push("unicorns")
      return 'unicorns!'
    })

    var provided = inject()

    provided.root
    provided.root
    provided.unicorns

    expect(sideEffects).toEqual(['root', 'unicorns'])
  })

  it('lets you override modules (e.g. with test doubles)', function() {
    inject('root', function(injected) {
      return 'I depend on ' + injected.unicorns
    })

    inject('unicorns', function() {
      return 'this will be stubbed in test'
    })

    var root = inject({unicorns: 'unicorns'}).root

    expect(root).toEqual('I depend on unicorns')
  })

  it('does not modify the object with overrides passed to inject()', function() {
    inject('root', function(injected) {
      return 'I depend on ' + injected.unicorns
    })

    inject('unicorns', function() {
      return 'this will be stubbed in test'
    })

    var overrides = {unicorns: 'unicorns'}
    inject(overrides).root

    expect(overrides).toEqual({unicorns: 'unicorns'})
  })

  //
  // Error handling:
  //

  it('throws if you provide nonsensical arguments', function() {
    expect(function() {
      inject(function() {})
    }).toThrowError("Poppins was called with unexpected arguments. You may want to have a look at the docs: https://github.com/benchristel/poppins/")

    expect(function() {
      inject(function() {}, 'asdf')
    }).toThrowError("Poppins was called with unexpected arguments. You may want to have a look at the docs: https://github.com/benchristel/poppins/")
  })

  it('throws if you provide more than two arguments', function() {
    expect(function() {
      inject('foo', function() {}, 1)
    }).toThrowError("Poppins was called with unexpected arguments. You may want to have a look at the docs: https://github.com/benchristel/poppins/")
  })

  it('throws if you request a module that does not exist', function() {
    if (runningOnCI()) {
      return
    }

    inject('foo', function() {})

    expect(function() { inject().bar })
      .toThrowError('Poppins: No factory registered for requested module "bar"')
  })

  it('throws if you try to override a module that does not exist', function() {
    expect(function() { inject({iDontExist: 1}) })
      .toThrowError("Poppins: You're trying to override iDontExist, but there is no such module.")
  })

  it('throws if there is a dependency cycle', function() {
    inject('a', function(inj) { inj.b })
    inject('b', function(inj) { inj.a })

    expect(function() { inject().a }).toThrowError('Poppins: Could not build a because there is a dependency cycle: a -> b -> a')
  })

  it('throws if you register new modules after building one', function() {
    // this is mostly to maintain parity between the polyfilled Proxy and the real one.
    // the polyfill seals the target of the proxy, so you can't add new properties
    // after the proxy is created.

    inject('a', function() { return 1 })

    inject().a

    expect(function() {
      inject('b', function() { return 2 })
    }).toThrowError("Poppins: You can't register a new module now because some modules have already been built.")
  })

  //
  // Weird edge cases:
  //

  describe('when modules have durn stuped names', function() {
    var sideEffects

    beforeEach(function() {
      sideEffects = []

      inject('root', function(injected) {
        sideEffects.push("root")
        return 'I depend on ' + injected.hasOwnProperty
      })

      inject('hasOwnProperty', function() {
        sideEffects.push("hasOwnProperty")
        return 'a stupidly-named thing'
      })
    })

    it('still caches properly', function() {
      var provided = inject()

      provided.root
      provided.root
      provided.hasOwnProperty

      expect(provided.root).toEqual('I depend on a stupidly-named thing')

      expect(sideEffects).toEqual(['root', 'hasOwnProperty'])
    })

    it('still throws good error messages', function() {
      if (runningOnCI()) {
        return
      }

      var provided = inject()
      expect(function() {
        provided.constructor
      }).toThrowError('Poppins: No factory registered for requested module "constructor"')
    })
  })
})

