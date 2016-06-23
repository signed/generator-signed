'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({

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
    git: function () {
      this.fs.copy(
        this.templatePath('.gitignore'),
        this._destinationProjectRoot('.gitignore')
      );
    },
    editorconfig: function () {
      this.fs.copy(
        this.templatePath('.editorconfig'),
        this._destinationProjectRoot('.editorconfig')
      );
    }
  },

  writing: {
    maven: function () {
      this.fs.copyTpl(
        this.templatePath('pom.xml'),
        this._destinationProjectRoot('pom.xml'), {
          artifactId: this.props.projectName,
          groupId: this.props.package
        }
      );
    },
    
    bootMainClass: function () {
      this.fs.copyTpl(
        this.templatePath('src/main/java/package/BootApplication.java'),
        this.destinationPath(this.props.projectName + '/src/main/java/' + this.props.package.split('.').join('/') + '/BootApplication.java'), {
          package: this.props.package
        }
      );
    }
  },

  _destinationProjectRoot: function (path) {
    return this.props.projectName + '/' + path;
  }
});
