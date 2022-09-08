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
2. For creating variative loading point use "load(&lt;moduleAbstractID&gt;)" function:
```js
const usersRepo = shortDi.load("IUsersRepository"); //its JS. 
//for TS you will need create your own interface of needle module and implement it.
//Create runtime checking of loaded class should you own too
```
3. in directory with main script create json config named like "&lt;scriptName&gt.shortdi.json&gt;":
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
const cityParser = shortDi.load("ICitiesParser"); 
```
Will works like:
```js
const cityParser = require("some-path-to-cities-parser-module"); 
```

# Notes
1. json short-di config file should be near main running script, and should contains resolvings for all "loads" in programm (includes required scripts).
2. json short-di config file should be names like "<main-script-name-without-ext>.shortdi.json".
3. json short-di file loadings only one time (with "register()" command or whith first "loading").
4. if if main script 'loadings' not using, but using later, in required modules, you should register di-config in main script with command "register()". If registering had not been before, it happening at first loading.
5. At first registering/loading all relative file-paths in di-config will convert to absolute, with using of main file dir path.
6. To avoid repetition of module identifiers, try to use as detailed module identifiers as possible.

# Example of registring
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
const someModule = shortDi.load("someModule1")
...
```
```js
//connected-module2-with-loads.js
const shortDi = require('short-di');
const someModule = shortDi.load("someModule2")
...
```
```js
//main-script.js
const shortDi = require('short-di');
const someModule = shortDi.register(); //will register this file as main, if di-config had not loaded early.
//Without registering in main-script programm will except main script is script where "load()" function first time uses, (means connected-module1-with-loads.js) and will try load di-config from "catalog1"
const connectedModule1 = require('./catalog1/connected-module1-with-loads')
const connectedModule1 = require('./catalog2/connected-module2-with-loads')
...
```

# Recipe
1. Uses shortDi loadings in some module.
2. Add configuration for it in unit-tests with loading dependency-stubs
3. In main program code resolve in di-config real dependencies it should use

# Author
- Anatoly Starodubstev "Pantagruel74"
- Tostar74@mail.ru

# License
- MIT