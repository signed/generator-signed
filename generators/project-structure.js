'use strict';
const path = require('path');
const globby = require('globby');

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.smartScaffold(path);
};

ProjectStructure.prototype.scaffoldTemplateInProjectRoot = function (path, templateVariables) {
  this.smartScaffold(path, templateVariables);
};

ProjectStructure.prototype.scaffoldGlobIn = function (source, options) {
  const globOptions = options.globOptions || {};
  var blub = this.generator.templatePath(source);
  var files = globby.sync(blub, globOptions);
  files.forEach(function (file) {
    var pathRelativeToTemplatePath = path.relative(this.generator.templatePath(), file);
    this.smartScaffold(pathRelativeToTemplatePath);
  }, this);
};

ProjectStructure.prototype.scaffoldGlobWithTemplate = function (source, templateVariables) {
  var files = globby.sync(this.generator.templatePath(source), {nodir: true});
  files.forEach(function (file) {
    var pathRelativeToTemplatePath = path.relative(this.generator.templatePath(), file);
    this.smartScaffold(pathRelativeToTemplatePath, templateVariables);
  }, this);
};

ProjectStructure.prototype.scaffoldJavaFile = function (absolutePathToJavaFile) {
  var templateDirectoryRelativePath = this._toTemplateDirectoryRelativePath(absolutePathToJavaFile);
  this.smartScaffold(templateDirectoryRelativePath);
};

ProjectStructure.prototype.smartScaffold = function (relativeTemplatePath, templateVariables) {
  if (this._endsWith(relativeTemplatePath, '.ejsArgs')) {
    return;
  }

  var resolvedTemplateArguments = typeof templateVariables === 'undefined' ? {} : templateVariables;
  var templateArgumentsPath = this.generator.templatePath(relativeTemplatePath + '.ejsArgs');
  if (this.generator.fs.exists(templateArgumentsPath)) {
    var templateArguments = this.generator.fs.readJSON(templateArgumentsPath);
    Object.keys(templateArguments).forEach(function (property) {
      resolvedTemplateArguments[property] = this.generator.configuration[property]();
    }, this);
  }

  var relativeDestinationPath = relativeTemplatePath;

  const suffix = '.java';
  if (this._endsWith(relativeTemplatePath, suffix)) {
    relativeDestinationPath = relativeTemplatePath.replace('package', this._javaBasePackageSegments().join(path.sep));
    resolvedTemplateArguments.package = this._javaPackageSegmentsFor(relativeTemplatePath).join('.');
  }
  this.generator.fs.copyTpl(
    this.generator.templatePath(relativeTemplatePath),
    this._projectRoot(relativeDestinationPath),
    resolvedTemplateArguments
  );
};

ProjectStructure.prototype._toTemplateDirectoryRelativePath = function (absolutePathToTemplateFile) {
  return path.relative(this.generator.templatePath(), absolutePathToTemplateFile);
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
