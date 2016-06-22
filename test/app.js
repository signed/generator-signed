'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-signed:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({projectName: 'example-project'})
      .toPromise();
  });

  it('creates a maven project model in a subfolder', function () {
    assert.file([
      'example-project/pom.xml'
    ]);
  });
});
