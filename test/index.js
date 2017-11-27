const {expect} = require('chai')
const parser = require('../')
const path = require('path')

describe('parser', () => {
  it('should parse and resolve spec files success', (done) => {
    const root = path.join(__dirname, '../fixture/api')
    const p = parser(path.normalize(root), {
      host: 'localhost:8080'
    }, '**/*.spec.yaml', '.spec.yaml', 'routes', false)

    p.then(function(definition) {
      expect(definition.paths).to.be.a('object')
      expect(Object.keys(definition.paths)).to.not.eql(0)
      expect(definition.definitions).to.be.a('object')
      expect(Object.keys(definition.definitions)).to.not.eql(0)
      expect(definition.parameters).to.be.a('object')
      expect(Object.keys(definition.parameters)).to.not.eql(0)
      expect(definition['x-pages']).to.be.a('object')
      expect(Object.keys(definition['x-pages'])).to.not.eql(0)
      expect(definition['x-errors']).to.be.a('object')
      expect(Object.keys(definition['x-errors'])).to.not.eql(0)
      return done()
    }).catch(done)
  })
})