'use strict';

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.log = function () {
  this.generator.log('greetings from the project structure');
};

ProjectStructure.prototype.scaffoldInProjectRoot = function (path) {
  this.generator.fs.copy(
    this.generator.templatePath(path),
    this.generator.props.projectName + '/' + path
  );
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
