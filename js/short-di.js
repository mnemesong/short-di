"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = void 0;
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var containerExt = '.shortdi.json';
function searchContainer(module, container) {
    if (container === void 0) { container = null; }
    var containerName = module.filename.slice(0, -1 * path.extname(module.filename).length) + containerExt;
    try {
        var newContainer = fs.readFileSync(containerName, 'utf-8');
        var encoded = JSON.parse(newContainer);
        assert.equal(typeof encoded, 'object');
        for (var key in encoded) {
            if (!path.isAbsolute(encoded[key])) {
                encoded[key] = absolutizePath(module, encoded[key]);
            }
        }
        container = encoded;
    }
    catch (error) {
    }
    if (module.parent) {
        return searchContainer(module.parent, container);
    }
    return container;
}
function absolutizePath(module, str) {
    if (!path.isAbsolute(str)) {
        str = path.join(module.path, str);
    }
    return str;
}
function load(loadModuleId, thisModule) {
    assert.ok(!!loadModuleId, "It is required to pass the loading module id as the first parameter");
    assert.ok(!!thisModule, "It is required to pass the module as the second parameter");
    var container = searchContainer(thisModule);
    assert.ok(!!container, "Short-di: Not enought container");
    var replacement = container[loadModuleId];
    assert.equal(typeof replacement, 'string');
    assert.ok(path.isAbsolute(replacement), "Get not absolute path: " + replacement);
    return require(replacement);
}
exports.load = load;
