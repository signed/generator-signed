'use strict';
var path = require('path');

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

ProjectStructure.prototype.scaffoldGlobIn = function (glob, destination, options) {
  this.generator.fs.copy(
    this.generator.templatePath(glob),
    this._projectRoot(destination),
    options
  );
};

ProjectStructure.prototype.scaffoldGlobWithTemplateIn = function (glob, destination, templateVariables) {
  this.generator.fs.copyTpl(
    this.generator.templatePath(glob),
    this._projectRoot(destination),
    templateVariables
  );
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
  templateVariables = typeof templateVariables === 'undefined' ? {} : templateVariables;
  const suffix = '.java';
  if (relativeTemplatePath.substr(-suffix.length) === suffix) {
    templateVariables.package = this._javaPackageSegementsFor(relativeTemplatePath).join('.');
  }
  this.generator.fs.copyTpl(
    this.generator.templatePath(relativeTemplatePath),
    this._projectRoot(relativeDestinationPath),
    templateVariables
  );
};

ProjectStructure.prototype._projectRoot = function (path) {
  return this.generator.destinationPath(path);
};
