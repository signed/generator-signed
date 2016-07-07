'use strict';

module.exports = Configuration;

function Configuration(generator) {
  this.generator = generator;
  this.answers = {};
  this.allOptions = {
    projectName: {
      prompt: {
        type: 'input',
        name: 'projectName',
        message: 'What is your projects name?',
        default: 'Pong: The Game'
      }
    },
    artifactName: {
      prompt: {
        type: 'input',
        name: 'projectName',
        message: 'How should the artifact be named',
        default: 'ping'
      }
    },
    package: {
      prompt: {
        type: 'input',
        name: 'package',
        message: 'What is your projects package?',
        default: 'org.example'
      }
    }
  };
}

Configuration.prototype.answers2 = function (answers) {
  this.answers = answers;
};

Configuration.prototype._alreadyAnsweredQuestions = function () {
  return Object.keys(this.generator.config.getAll());
};

Configuration.prototype.prompts = function () {
  var dada = Object.keys(this.allOptions);
  var stillToAnswerOptions = dada.filter(function (option) {
    return !(this._alreadyAnsweredQuestions().indexOf(option) >= 0);
  }.bind(this));

  return stillToAnswerOptions.map(function (stillToAnswerOption) {
    return this.allOptions[stillToAnswerOption].prompt;
  }.bind(this));
};

Configuration.prototype.storeAnswers = function () {
  this.generator.config.set(this.answers);
};

Configuration.prototype.projectName = function () {
  return this.generator.config.get('projectName');
};

Configuration.prototype.artifactName = function () {
  return this.generator.config.get('artifactName');
};

Configuration.prototype.package = function () {
  return this.generator.config.get('package');
};
