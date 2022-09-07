const path = require('path');
const loader = require(path.resolve(__dirname, '../js/shortDi'));
const assert = require('assert');

it('test register', () => {
    assert.equal(!!global.fastDi, false);
    loader.register();
    assert.deepEqual(global.fastDi, {
        "someI": path.resolve(__dirname, "./someFile.js")
    });
}); 

it('test load', () => {
    const someFile = loader.load('someI');
    assert.equal(someFile.returnAboba(), 'aboba');
});