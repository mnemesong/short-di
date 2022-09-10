import * as Module from 'module';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
const containerExt = '.shortdi.json';

function searchContainer(module: Module, container: object = null): object|null
{
    let containerName: string = module.filename.slice(0, -1  * path.extname(module.filename).length) + containerExt;
    try {
        let newContainer: string = fs.readFileSync(containerName, 'utf-8');
        let encoded: object = JSON.parse(newContainer);
        assert.equal(typeof encoded, 'object');
        for(let key in encoded)
        {
            if(!path.isAbsolute(encoded[key])) {
                encoded[key] = absolutizePath(module, encoded[key]);
            }
        }
        container = encoded;
    } catch (error) {
    }
    if(module.parent) {
        return searchContainer(module.parent, container);
    }
    return container;
}

function absolutizePath(module: Module, str: string): string
{
    if(!path.isAbsolute(str)) {
        str = path.join(module.path, str);
    }
    return str;
}

export function load(loadModuleId: string, thisModule: Module): any
{
    assert.ok(!!loadModuleId, "It is required to pass the loading module id as the first parameter");
    assert.ok(!!thisModule, "It is required to pass the module as the second parameter");
    let container: object = searchContainer(thisModule);
    assert.ok(!!container, "Short-di: Not enought container");
    let replacement: string = container[loadModuleId];
    assert.equal(typeof replacement, 'string');
    assert.ok(path.isAbsolute(replacement), "Get not absolute path: " + replacement);
    return require(replacement);
}