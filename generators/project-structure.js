'use strict';
const path = require('path');
const globby = require('globby');

const TemplateArgumentFileExtension = '.ejsArgs';

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.smartScaffold(path);
};

ProjectStructure.prototype.scaffoldGlobInProjectRoot = function (source) {
  var files = globby.sync(this.generator.templatePath(source), {dot: true, nodir: true});
  files.forEach(function (file) {
    var pathRelativeToTemplatePath = path.relative(this.generator.templatePath(), file);
    this.smartScaffold(pathRelativeToTemplatePath);
  }, this);
};

ProjectStructure.prototype.smartScaffold = function (relativeTemplatePath) {
  if (this._endsWith(relativeTemplatePath, TemplateArgumentFileExtension)) {
    return;
  }

  var resolvedTemplateArguments = {};
  var templateArgumentsPath = this.generator.templatePath(relativeTemplatePath + TemplateArgumentFileExtension);
  if (this.generator.fs.exists(templateArgumentsPath)) {
    var templateArguments = this.generator.fs.readJSON(templateArgumentsPath);
    Object.keys(templateArguments).forEach(function (property) {
      var toResolve = templateArguments[property];
      resolvedTemplateArguments[property] = this.generator.configuration[toResolve]();
    }, this);
  }

  var relativeDestinationPath = relativeTemplatePath;

  if (this._endsWith(relativeTemplatePath, '.java')) {
    relativeDestinationPath = relativeTemplatePath.replace('package', this._javaBasePackageSegments().join(path.sep));
    resolvedTemplateArguments.package = this._javaPackageSegmentsFor(relativeTemplatePath).join('.');
  }

  this.generator.fs.copyTpl(
    this.generator.templatePath(relativeTemplatePath),
    this._projectRoot(relativeDestinationPath),
    resolvedTemplateArguments
  );
};

ProjectStructure.prototype._javaPackageSegmentsFor = function (relativeTemplatePath) {
  var relativePathSegments = relativeTemplatePath.split(path.sep);
  var packageIndex = relativePathSegments.indexOf('package');
  relativePathSegments.pop();
  relativePathSegments.splice(0, packageIndex + 1);
  return this._javaBasePackageSegments().concat(relativePathSegments);
};

ProjectStructure.prototype._javaBasePackageSegments = function () {
  return this.generator.configuration.package().split('.');
};

ProjectStructure.prototype._endsWith = function (string, suffix) {
  return string.substr(-suffix.length) === suffix;
};

ProjectStructure.prototype._projectRoot = function (path) {
  return this.generator.destinationPath(path);
};
