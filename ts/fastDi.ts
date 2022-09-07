import assert = require('assert');
import * as fs from 'fs';
import * as path from 'path';

function assertCorrectnessModulePath(connectingModulePath: any): void
{
    assert.equal(
        typeof connectingModulePath, 
        'string', 
        'Fast-di: Expected container identifier resolve is string, ' + (typeof connectingModulePath) +' given'
    );
}

/**
 * Tries to load the module specified in the config of the registered di-container. 
 * If the Di-container is registered earlier, it tries to load the module specified in its config.
 * 
 * @param moduleStr 
 * @param fastDiConfigFilePath 
 */
export function load(moduleStr: string): any
{
    register();
    assert.equal(!global.fastDi[moduleStr], false, 
        'Fast-di: Cant load module with identifier ' + moduleStr  + ' case it missing in di-config.');

    let connectingModulePath = global.fastDi[moduleStr];
    assertCorrectnessModulePath(connectingModulePath);

    return require(connectingModulePath);
}

/**
 * Tries to register di-container config.
 * 
 * @param fastDiConfigFilePath 
 */
export function register(): void
{
    if(!global.fastDi) {
        let modParFn = module.parent.filename;
        console.log('loading: ' + modParFn);
        let fastDiConfigFilePath = modParFn.slice(0, -1 * path.extname(modParFn).length) + '.fastdi.json';
        let configData = fs.readFileSync(fastDiConfigFilePath, 'utf-8');
        let configJson = JSON.parse(configData);

        for(let key in configJson)
        {
            assertCorrectnessModulePath(configJson[key]);
            if(!path.isAbsolute(configJson[key])) {
                configJson[key] = path.join(path.dirname(fastDiConfigFilePath), configJson[key]);
            }
        }

        global.fastDi = configJson;
    }
}