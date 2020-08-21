/* global describe, it */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const property = require('../../../main/decorators/property')

describe('unit tests of @property', () => {
  it('should happily work with defaults', function () {
    class Foo {
      @property()
      _it
    }

    const p = Foo.prototype
    expect(typeof p.withIt).to.equal('function')
    expect(typeof p._testSetIt).to.equal('function')
    expect(typeof p._doSetIt).to.equal('function')

    const pd = Object.getOwnPropertyDescriptor(p, 'it')
    expect(pd).to.be.ok()
    expect(typeof pd.get).to.equal('function')
    expect(typeof pd.set).to.equal('function')
    expect(pd.enumerable).to.be.false()
    expect(pd.configurable).to.be.false()

    const f = new Foo()

    const val = 1
    f.it = val
    expect(f._it).to.equal(val)
    const val2 = 2
    const f2 = f.withIt(val2)
    expect(f2).to.equal(f)
    expect(f._it).to.equal(val2)
  })

  it('should happily work with custom test method', function () {
    let x = 0

    class Foo {
      @property()
      _it

      _testSetIt (it) {
        x++
        return it
      }
    }

    const f = new Foo()
    const val = 1
    f.it = val
    expect(f._it).to.equal(val)
    expect(x).to.equal(1)
  })

  it('should happily work with custom settings', function () {
    class Foo {
      @property({ name: 'value', builder: false })
      _it
    }
    expect(Foo.prototype.withValue).to.be.undefined()

    const f = new Foo()
    const val = 1
    f.value = val
    expect(f._it).to.equal(val)
    const val2 = 2
    f.value = val2
    expect(f._it).to.equal(val2)
  })
})
