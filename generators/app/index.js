'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
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
      message: 'What is your projects name?'
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
    maven: function () {
      this.fs.copyTpl(
        this.templatePath('pom.xml'),
        this.props.projectName + '/' + 'pom.xml', {
          artifactId: this.props.projectName,
          groupId: this.props.package
        }
      );
    },


    bootMainClass: function () {
      this.fs.copyTpl(
        this.templatePath('src/main/java/package/BootApplication.java'),
        this.props.projectName + '/' + 'src/main/java/' + this.props.package.split('.').join('/') + '/BootApplication.java', {
          package: this.props.package
        }
      );
    },

    logbackConfiguration: function () {
      this.fs.copyTpl(
        this.templatePath('src/main/resources/logback.xml'),
        this.props.projectName + '/' + 'src/main/resources/logback.xml'
      );
    }
  }
});
