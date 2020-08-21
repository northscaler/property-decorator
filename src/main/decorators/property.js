/**
 * Decorator that optionally produces an accessor, a mutator, a test method, a backing property mutator, and a fluent builder method.
 *
 * @param {object} [arg0] The argument to be deconstructed.
 * @param {string} [arg0.name] The name of the generated property.
 * By default, it is the name of the backing property without its first character, as backing properties, by convention, should have a leading underscore prefix (`_`).
 * That way, backing property `_foo` results in a default property name of `foo`.
 * @param {boolean} [arg0.get=true} Whether to generate an accessor (`get` method).
 * The accessor is not generated if the class already has that accessor.
 * @param {boolean} [arg0.set=true} Whether to generate a mutator (`set` method).
 * The mutator is not generated if the class already has that mutator.
 * @param {string|boolean} [arg0.builder='with'} If a `boolean`, whether to generate a builder method with the prefix `with`.
 * If a `string`, the prefix of the builder method that will be generated.
 * The builder method is not generated if a mutator is not being generated, or the class already has a method `withXxx`, where `Xxx` is the value of the `name` parameter.
 * @param {boolean} [arg0.enumerable=false] The `enumerable` value to pass along to `Object.defineProperty()`.
 * @param {boolean} [arg0.configurable=false] The `configurable` value to pass along to `Object.defineProperty()`.
 * @return {function} A decorator function.
 */
const property = function ({
  name,
  get = true,
  set = true,
  builder = 'with',
  enumerable = false,
  configurable = false,
  testSetMethodPrefix = '_testSet',
  doSetMethodPrefix = '_doSet'
} = {}) {
  return function (prototype, backingPropertyName) {
    name = name || backingPropertyName.slice(1)

    const upper = `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    const doSetMethodName = `${doSetMethodPrefix}${upper}`
    const testSetMethodName = `${testSetMethodPrefix}${upper}`

    const attributes = { configurable, enumerable }

    if (get) {
      attributes.get = function () {
        return this[backingPropertyName]
      }
    }

    if (set) {
      attributes.set = function (val) {
        this[doSetMethodName](this[testSetMethodName](val))
      }

      if (!prototype[doSetMethodName]) {
        prototype[doSetMethodName] = function (val) {
          this[backingPropertyName] = val
          return this
        }
      }

      if (!prototype[testSetMethodName]) {
        prototype[testSetMethodName] = function (val) {
          return val
        }
      }

      if (builder) {
        const builderMethodName = `${
          typeof builder === 'boolean' ? 'with' : builder
        }${upper}`
        if (!prototype[builderMethodName]) {
          prototype[builderMethodName] = function (val) {
            this[name] = val
            return this
          }
        }
      }
    }

    if (get || set) Object.defineProperty(prototype, name, attributes)
  }
}

module.exports = property
