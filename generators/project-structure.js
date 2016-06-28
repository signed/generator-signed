'use strict';

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.generator.fs.copy(
    this.generator.templatePath(path),
    this.generator.props.projectName + '/' + path
  );
};

ProjectStructure.prototype.scaffoldGlobIn = function (glob, destination, options) {
  this.generator.fs.copy(
    this.generator.templatePath(glob),
    this.generator.props.projectName + '/' + destination,
    options);
};

ProjectStructure.prototype.scaffoldTemplateInProjectRoot = function (path, templateVariables) {
  this.generator.fs.copyTpl(
    this.generator.templatePath(path),
    this.generator.props.projectName + '/' + path, templateVariables);
};

ProjectStructure.prototype.scaffoldJavaFile = function (javaFile) {
  var destinationPath = javaFile.replace('package', this.generator.props.package.split('.').join('/'));
  this.generator.fs.copyTpl(
    this.generator.templatePath(javaFile),
    this.generator.destinationPath(this.generator.props.projectName + '/' + destinationPath), {
      package: this.generator.props.package
    }
  );
};
