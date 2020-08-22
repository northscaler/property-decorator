# `@northscaler/property-decorator`
Provides behaviorially-rich public properties based on non-public backing properties on JavaScript classes.

## Overview
Using this decorator avoids a lot of boilerplate code.
You no longer have to manually write:
* `get` method
* `set` method
* `_testSetXxx` method
* `_doSetXxx` method
* `withXxx` method

## TL;DR
When you write this:
```javascript
const property = require('@northscaler/property-decorator')

class MyClass {
  @property()
  _foo
}
```
The decorator defines the equivalent of the following on `MyClass`: 
```javascript
class MyClass {
  _foo
  
  get foo() {                                // getter
    return this._foo
  }
  set foo(value) {                           // validating/scrubbing setter
    this._doSetFoo(this._testSetFoo(value))
  }
  _testSetFoo(value) {                       // validates/scrubs value
    return value
  }
  _doSetFoo(value) {                         // actually sets backing property
    this._foo = value
  }
  withFoo(value) {                           // fluent builder pattern method
    this.foo = value
    return this
  }
}
```
Now, you can use `MyClass` like this:
```javascript
const it = new MyClass().withFoo(1) // demonstrates builder pattern
console.log(it.foo) // logs 1

it.foo = 2
console.log(it.foo) // logs 2
```

## Configuration
This decorator depends on currently experimental features of ECMAScript:
* decorators
* class properties

Make sure your project configures Babel plugins similar to the following:
```javascript
"plugins": [
  [
    "@babel/plugin-proposal-decorators",
    {
      "legacy": true
    }
  ],
  [
    "@babel/plugin-proposal-class-properties",
    {
      "loose": false
    }
  ]
]
```
You can copy them straight out of this module's `package.json` if you want to.

## Best practices
The idea is that the decorator takes care of the boilerplate and you take care of the important bits.
That usually boils down to providing your own method that validates and possibly scrubs the incoming value passed into to a mutator.

For example, if you only want property `_foo` to contain even integers:
```javascript
const property = require('@northscaler/property-decorator')

class MyClass {
  @property()
  _foo

  _testSetFoo(value) {
    const n = parseInt(value)
    if (isNaN(n) || n !== parseFloat(value) || n % 2 !== 0) {
      throw new Error('given value is not an even integer')
    }
    return n // return scrubbed value
  }
}
```
