'use strict';
var Configuration = require('../generators/configuration');
var expect = require('chai').expect;

describe('Configuration', function () {
  var generator = {
    config: {
      getAll: function () {
        return {};
      }
    }
  };

  var configuration = new Configuration(generator);
  describe('prompts', function () {
    describe('contain missing configuration', function () {
      it('package', function () {
        expect(configuration.prompts()).to.include({
          type: 'input',
          name: 'package',
          message: 'What is your projects package?',
          default: 'org.example'
        });
      });
    });
    describe('not contain already provided configuration', function () {
    });
  });
})
;
