# short-di
Short di loading from config tool. Used to loosen coupling between js modules, and realization Dependency-inversion principle.

# Installation
For installation type npm command
```bash
npm i short-di --save
```

# Usage
1. Require or import short-di package like:
```js
const shortDi = require('short-di'); //for JS
```
```typescript
import * as shortDi from 'short-di'; //for TS
```
2. For creating variative loading point use "load(&lt;moduleAbstractID&gt;, &lt;currentModule&gt;)" function:
```js
const usersRepo = shortDi.load("IUsersRepository", module); //its JS. 
//for TS you will need create your own interface of needle module and implement it.
//Create runtime checking of loaded class should you own too
```
3. in directory with main script create json config named like "&lt;scriptName&gt;.shortdi.json":
```
//files example:
...
index.js
index.shortdi.json
```
4. In this json file add modules thats should be loaded instead of abstract identifiers. For example:
```json
//index.shortdi.json
{
    "IUserRepository": "../repositories/mysql/mysql-user-repository"
} 
```
5. Short-di package will load this modules instead abstract-module-ids you specified in "load()" function.

In other words, with config:
```json
//index.shortdi.json
{
    "ICitiesParser": "some-path-to-cities-parser-module"
} 
```
The code:
```js
const cityParser = shortDi.load("ICitiesParser", module); 
```
Will works like:
```js
const cityParser = require("some-path-to-cities-parser-module"); 
```

# Notes
1. json short-di config file should be near main running script, and should contains resolvings for all "loads" in programm (includes required scripts).
2. json short-di config file should be names like "<main-script-name-without-ext>.shortdi.json".
3. The realization and mechanics had been full reworked from v0.2, and became race-condition-safety. Now may be used in asynchronous functions and asynchronous-uses-frameworks like "mocha".
4. To avoid repetition of module identifiers, try to use as detailed module identifiers as possible.
5. When loading, program will run from passed module by parents, checks existance of "<moduleName>.shortdi.json"-like di-config-files, and uses the most-close-to-main-script di-config-file.
### For example:
if module-parents cache looks like:
```
+ main-script (has .shortdi.json file)
+ first-required-script (has .shortdi.json file)
+ script-where-used-shortdi-load (has not .shortdi.json file)
```
then will be used config of main-script, case it most close to main script.

# Advanced example
```
//file-system
main-script.js
main-script.shortdi.json
+catalog1
|-connected-module1-with-loads.js
|-+included-catalog
| |-loaded-module-1.js
+catalog2
|-connected-module1-with-loads.js
|-+included-catalog
| |-loaded-module-2.js
...
```
```json
//main-script.shortdi.json
{
    "someModule1": "./included-catalog/loaded-module-1",
    "someModule2": "./included-catalog/loaded-module-2",
}
```
```js
//connected-module1-with-loads.js
const shortDi = require('short-di');
const someModule = shortDi.load("someModule1", module)
...
```
```js
//connected-module2-with-loads.js
const shortDi = require('short-di');
const someModule = shortDi.load("someModule2", module)
...
```
```js
//main-script.js
const shortDi = require('short-di');
const connectedModule1 = require('./catalog1/connected-module1-with-loads')
const connectedModule1 = require('./catalog2/connected-module2-with-loads')
...
```

# Recipes
1. Uses shortDi loadings in some module.
2. Add configuration for it in unit-tests with loading dependency-stubs
3. In main program code resolve in di-config real dependencies it should use

# Author
- Anatoly Starodubstev "Pantagruel74"
- Tostar74@mail.ru

# License
- MIT