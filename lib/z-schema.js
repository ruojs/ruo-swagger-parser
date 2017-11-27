const ZSchema = require('z-schema')
const isNumber = require('lodash.isnumber');

const validators = {}

function returnTrue () {
  return true
}

validators.int32 = validators.int64 = function (val) {
  // z-schema seems to continue processing the format even when the type is known to be invalid so we must do a type
  // check prior to validating this format.
  return isNumber(val) && val % 1 === 0
}

// These format validators will always return 'true' because they are already type valid and there are no constraints
// on the format that would produce an invalid value.
validators.byte = returnTrue
validators.double = returnTrue
validators.float = returnTrue
validators.password = returnTrue

// Add the custom validators
Object.keys(validators).forEach(function (name) {
  ZSchema.registerFormat(name, validators[name])
})

module.exports = ZSchema
