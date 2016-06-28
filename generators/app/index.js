'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');
var ProjectStructure = require('../project-structure');

module.exports = yeoman.Base.extend({

  constructor: function () {
    yeoman.Base.apply(this, arguments);
    this.projectStructure = new ProjectStructure(this);
    this.projectStructure.log();
  },

  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the finest ' + chalk.red('generator-signed') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'projectName',
      message: 'What is your projects name?',
      default: 'ping'
    }, {
      type: 'input',
      name: 'package',
      message: 'What is your projects package?',
      default: 'org.example'
    }];

    return this.prompt(prompts).then(function (props) {
      this.props = props;
    }.bind(this));
  },

  configuring: {
    filesInProjectRoot: function () {
      this.fs.copy(this.templatePath('*'), this.props.projectName, {
        globOptions: {
          dot: true,
          ignore: ['**/pom.xml']
        }
      });
    }
  },

  writing: {

    copyAdditionalBuildConfigurationFiles: function () {
      this.projectStructure.scaffoldInProjectRoot('etc/');
    },

    maven: function () {
      this.projectStructure.scaffoldTemplateInProjectRoot('pom.xml', {
        artifactId: this.props.projectName,
        groupId: this.props.package
      });
    },

    logbackConfiguration: function () {
      this.projectStructure.scaffoldInProjectRoot('src/main/resources/logback.xml');
    },

    javaSourceFiles: function () {
      var prefix = new RegExp('^' + this.templatePath() + '/');
      var files = glob.sync(this.templatePath('**/*.java')).map(function (path) {
        return path.replace(prefix, '');
      });
      files.forEach(function (javaFileInTemplateDirectory) {
        this.projectStructure.scaffoldJavaFile(javaFileInTemplateDirectory);
      }, this);
    }
  }
});
