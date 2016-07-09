'use strict';
var path = require('path');

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.generator.fs.copy(
    this.generator.templatePath(path),
    this._projectRoot(path)
  );
};

ProjectStructure.prototype.scaffoldGlobIn = function (glob, destination, options) {
  this.generator.fs.copy(
    this.generator.templatePath(glob),
    this._projectRoot(destination),
    options
  );
};

ProjectStructure.prototype.scaffoldGlobWithTemplateIn = function (glob, destination, templateVariables, options) {
  this.generator.fs.copyTpl(
    this.generator.templatePath(glob),
    this._projectRoot(destination),
    templateVariables,
    options
  );
};

ProjectStructure.prototype.scaffoldTemplateInProjectRoot = function (path, templateVariables) {
  this.generator.fs.copyTpl(
    this.generator.templatePath(path),
    this._projectRoot(path),
    templateVariables
  );
};

ProjectStructure.prototype.scaffoldJavaFile = function (absolutePathTojavaFile) {
  var prefix = new RegExp('^' + this.generator.templatePath() + '/');
  var templateDirectoryRelativePath = absolutePathTojavaFile.replace(prefix, '');

  var segments = templateDirectoryRelativePath.split(path.sep);
  var packageIndex = segments.indexOf('package');

  segments.pop();
  segments.splice(0, packageIndex + 1);

  var basePackageSegments = this.generator.configuration.package().split('.');
  var packageSegments = basePackageSegments.concat(segments);

  var destinationPath = templateDirectoryRelativePath.replace('package', basePackageSegments.join('/'));
  var packageForFile = packageSegments.join('.');

  this.generator.fs.copyTpl(
    this.generator.templatePath(templateDirectoryRelativePath),
    this._projectRoot(destinationPath), {
      package: packageForFile
    }
  );
};

ProjectStructure.prototype._projectRoot = function (path) {
  return this.generator.destinationPath(path);
};
