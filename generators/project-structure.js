'use strict';

module.exports = ProjectStructure;

function ProjectStructure(generator) {
  this.generator = generator;
}

ProjectStructure.prototype.log = function () {
  this.generator.log('greetings from the project structure');
};
