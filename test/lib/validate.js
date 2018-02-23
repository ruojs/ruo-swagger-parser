const {expect} = require('chai')
const validate = require('../lib/validate')
const schemaToJson = validate.schemaToJson

describe('validate', () => {
  describe('schemaToJson', () => {
    it('should generate sample success', (done) => {
      const schema = {
        "type": "object",
        "properties": {
          "result": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "error_code": {
                  "type": [
                    "string",
                    "number"
                  ],
                  "description": "错误码"
                }
              }
            }
          }
        }
      };

      expect(schemaToJson(schema)).to.be.eql({"result":[{"error_code":"stringValue"}]})
      return done()
    })
  })
})
