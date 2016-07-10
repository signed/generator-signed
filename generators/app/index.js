'use strict';
const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const glob = require('glob');
const ProjectStructure = require('../project-structure');
const Configuration = require('../configuration');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.projectStructure = new ProjectStructure(this);
    this.configuration = new Configuration(this);
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the finest ' + chalk.red('generator-signed') + ' generator!'
    ));

    return this.prompt(this.configuration.prompts()).then(function (answers) {
      this.configuration.answers2(answers);
    }.bind(this));
  },

  configuring: {
    storeAnswers: function () {
      this.configuration.storeAnswers();
    },

    filesInProjectRoot: function () {
      this.projectStructure.scaffoldGlobIn('*', {
        globOptions: {
          dot: true,
          nodir: true,
          ignore: ['**/pom.xml']
        }
      });
    }
  },

  writing: {

    additionalBuildConfigurationFiles: function () {
      this.projectStructure.scaffoldInProjectRoot('etc/');
    },

    maven: function () {
      this.projectStructure.scaffoldTemplateInProjectRoot('pom.xml');
    },

    mavenResources: function () {
      this.projectStructure.scaffoldGlobWithTemplate('src/main/resources/**');
    },

    javaSourceFiles: function () {
      var files = glob.sync(this.templatePath('**/*.java'));
      files.forEach(function (javaFileInTemplateDirectory) {
        this.projectStructure.scaffoldJavaFile(javaFileInTemplateDirectory);
      }.bind(this));
    }
  }
});
