'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

var projectDirectory = function (path) {
  return path;
};

describe('generator-signed:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        projectName: 'Example Project',
        artifactName: 'example-project',
        package: 'example'
      })
      .toPromise();
  });

  it('creates a maven project model in a subfolder', function () {
    assert.file(
      projectDirectory('pom.xml')
    );
  });

  it('creates a .editorconfig', function () {
    assert.file(
      projectDirectory('.editorconfig')
    );
  });

  it('creates a .gitignore', function () {
    assert.file(
      projectDirectory('.gitignore')
    );
  });

  it('creates spring boot main class in package', function () {
    assert.file(
      projectDirectory('src/main/java/example/BootApplication.java')
    );
  });

  it('create a basic logback configuration', function () {
    assert.file(
      projectDirectory('src/main/resources/logback.xml')
    );
  });

  it('create the etc/ directory', function () {
    assert.file(projectDirectory('etc/'));
  });


  it('put projectName into swagger file', function () {
    assert.fileContent(
      projectDirectory('src/main/resources/static/index.html'), '<title>Example Project Rest API</title>'
    );
  });
});
