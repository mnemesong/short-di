"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.load = void 0;
var assert = require("assert");
var fs = require("fs");
var path = require("path");
function assertCorrectnessModulePath(connectingModulePath) {
    assert.equal(typeof connectingModulePath, 'string', 'Fast-di: Expected container identifier resolve is string, ' + (typeof connectingModulePath) + ' given');
}
/**
 * Tries to load the module specified in the config of the registered di-container.
 * If the Di-container is registered earlier, it tries to load the module specified in its config.
 *
 * @param moduleStr
 * @param fastDiConfigFilePath
 */
function load(moduleStr) {
    register();
    assert.equal(!global.fastDi[moduleStr], false, 'Fast-di: Cant load module with identifier ' + moduleStr + ' case it missing in di-config.');
    var connectingModulePath = global.fastDi[moduleStr];
    assertCorrectnessModulePath(connectingModulePath);
    return require(connectingModulePath);
}
exports.load = load;
/**
 * Tries to register di-container config.
 *
 * @param fastDiConfigFilePath
 */
function register() {
    if (!global.fastDi) {
        var modParFn = module.parent.filename;
        console.log('loading: ' + modParFn);
        var fastDiConfigFilePath = modParFn.slice(0, -1 * path.extname(modParFn).length) + '.fastdi.json';
        var configData = fs.readFileSync(fastDiConfigFilePath, 'utf-8');
        var configJson = JSON.parse(configData);
        for (var key in configJson) {
            assertCorrectnessModulePath(configJson[key]);
            if (!path.isAbsolute(configJson[key])) {
                configJson[key] = path.join(path.dirname(fastDiConfigFilePath), configJson[key]);
            }
        }
        global.fastDi = configJson;
    }
}
exports.register = register;
