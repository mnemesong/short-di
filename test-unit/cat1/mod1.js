const shortDi = require('../../js/short-di');
const load = shortDi.load("load1", module);

exports.func = void 0;

function func() {
    return load.func('aaa');
}

exports.func = func;