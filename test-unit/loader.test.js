console.log('run test loader.test.js');
const path = require('path');
const assert = require('assert');
const shortDi = require('../js/short-di');

it('test load', () => {
    const someFile = shortDi.load('someI', module);
    console.log(someFile);
    assert.equal(someFile.returnAboba(), 'aboba');
});

it('test errors', () => {
    assert.throws(() => {shortDi.load('someI')});
    assert.throws(() => {shortDi.load()});
    //Testing error when script has no container. 
    //The parent of this script is some of Mocha scripts and it should have no containers
    assert.throws(() => {shortDi.load('someI', module.parent)});
});