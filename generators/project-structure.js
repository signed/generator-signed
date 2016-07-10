'use strict';
var path = require('path');
const globby = require('globby');

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
  this.templateDirectoryBasePathRegEx = new RegExp('^' + this.generator.templatePath() + '/');
}

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.smartScaffold(path, path);
};

ProjectStructure.prototype.scaffoldTemplateInProjectRoot = function (path, templateVariables) {
  this.smartScaffold(path, path, templateVariables);
};

ProjectStructure.prototype.scaffoldGlobIn = function (source, options) {
  const globOptions = options.globOptions || {};
  var blub = this.generator.templatePath(source);
  var files = globby.sync(blub, globOptions);
  files.forEach(function (file) {
    var pathRelativeToTemplatePath = path.relative(this.generator.templatePath(), file);
    this.smartScaffold(pathRelativeToTemplatePath, pathRelativeToTemplatePath);
  }, this);
};

ProjectStructure.prototype.scaffoldGlobWithTemplate = function (source, templateVariables) {
  var files = globby.sync(this.generator.templatePath(source), {nodir: true});
  files.forEach(function (file) {
    var pathRelativeToTemplatePath = path.relative(this.generator.templatePath(), file);
    this.smartScaffold(pathRelativeToTemplatePath, pathRelativeToTemplatePath, templateVariables);
  }, this);
};

ProjectStructure.prototype.scaffoldJavaFile = function (absolutePathToJavaFile) {
  var templateDirectoryRelativePath = this._toTemplateDirectoryRelativePath(absolutePathToJavaFile);
  var destinationPath = templateDirectoryRelativePath.replace('package', this._javaBasePackageSegments().join(path.sep));
  this.smartScaffold(templateDirectoryRelativePath, destinationPath);
};

ProjectStructure.prototype._toTemplateDirectoryRelativePath = function (absolutePathToTemplateFile) {
  return absolutePathToTemplateFile.replace(this.templateDirectoryBasePathRegEx, '');
};

ProjectStructure.prototype._javaPackageSegementsFor = function (relativeTemplatePath) {
  var relativePathSegments = relativeTemplatePath.split(path.sep);
  var packageIndex = relativePathSegments.indexOf('package');
  relativePathSegments.pop();
  relativePathSegments.splice(0, packageIndex + 1);
  return this._javaBasePackageSegments().concat(relativePathSegments);
};

ProjectStructure.prototype._javaBasePackageSegments = function () {
  return this.generator.configuration.package().split('.');
};

ProjectStructure.prototype.smartScaffold = function (relativeTemplatePath, relativeDestinationPath, templateVariables) {
  this.generator.log(relativeDestinationPath);
  if (this.endsWith(relativeTemplatePath, '.ejsArgs')) {
    return;
  }

  templateVariables = typeof templateVariables === 'undefined' ? {} : templateVariables;
  const suffix = '.java';
  if (this.endsWith(relativeTemplatePath, suffix)) {
    templateVariables.package = this._javaPackageSegementsFor(relativeTemplatePath).join('.');
  }
  this.generator.fs.copyTpl(
    this.generator.templatePath(relativeTemplatePath),
    this._projectRoot(relativeDestinationPath),
    templateVariables
  );
};

ProjectStructure.prototype.endsWith = function (relativeTemplatePath, suffix) {
  return relativeTemplatePath.substr(-suffix.length) === suffix;
};

ProjectStructure.prototype._projectRoot = function (path) {
  return this.generator.destinationPath(path);
};
