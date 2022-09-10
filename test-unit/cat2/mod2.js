const shortDi = require('../../js/short-di');
const load = shortDi.load("load2", module);

exports.func = void 0;

function func() {
    return load.func('bbb');
}

exports.func = func;