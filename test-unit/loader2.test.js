console.log('run test loader2.test.js');
const path = require('path');
const assert = require('assert');

const module2 = require('./cat2/mod2');
const module1 = require('./cat1/mod1');


it("test complex includense", () => {
    assert.equal(module1.func(), 'aaa!!!');
    assert.equal(module2.func(), 'bbb???');
})
