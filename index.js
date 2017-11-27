const fs = require('fs')

const merge = require('lodash.merge')
const find = require('lodash.find')
const {resolveRefs: resolve} = require('json-refs')

const parse = require('./lib/parse')
const validate = require('./lib/validate')

module.exports = function(root, dynamicDefinition, pattern = '**/*-spec.yaml', suffix = '.spec.yaml', prefix = 'api', shadow = false) {
  const definition = parse(root, pattern = '**/*-spec.yaml', suffix = '.spec.yaml', prefix = 'api', shadow = false)

  merge(definition, dynamicDefinition)
  return resolve(definition).then(({resolved}) => {
    validate(resolved)
    return resolved
  })
}