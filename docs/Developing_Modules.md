

# Sathya Module API
Plugins for Sathya are designed as CommenJS (Node) modules.

Plugins must be contained in a folder in the "Modules" directory.
The entry point for a module is the Main.js file.

## Table of Contents
- [Sathya Module API](#sathya-module-api)
  * [Main.js spec](#mainjs-spec)
  * [sathyaServerState](#sathyaserverstate)
    + [Working with the ServerState](#working-with-the-serverstate)
      - [Temporary State](#temporary-state)
    + [Interaction using the ServerState (Creating a Module API)](#interaction-using-the-serverstate--creating-a-module-api-)
    + [Keep the ServerState Clean!](#keep-the-serverstate-clean-)
    + [Deleting State Properties](#deleting-state-properties)
  * [Writing Modules in Java](#writing-modules-in-java)
    + [Writings Modules in JS, but using Java libraries.](#writings-modules-in-js--but-using-java-libraries)
    + [Writing Modules in Java](#writing-modules-in-java-1)
  * [Sathya Polyglot](#sathya-polyglot)
  * [Config](#config)
  * [Databases](#databases)
  * [Background Services](#background-services)
  * [Exported Node Modules](#exported-node-modules)
  * [Disabling Modules](#disabling-modules)
  * [Sathya PubSub](#sathya-pubsub)

## Main.js spec
There are two requirements for the Main.js file.
* An `async function init(action, sathyaServerState, sathyaHelpers) {}` function.
* The init function exported (`module.exports = init;`)

The init function is called by Sathya during the startup or shutdown of the server.

> Note that init is an async function. When Sathya calls your module's init, it will be called with "await".
> This is particularly useful during shutdown, so Sathya doesn't shutdown before your module finishes it's cleanup.

Sathya passes three parameters to init:
* action: A string that specifies whether init is being called during startup or shutdown.
  * Values: "START", "STOP"
* sathyaServerState: an instance of the global ServerState class. This gives you access to the getState and setState functions.
* sathyaHelpers: an instance of the Helpers core module. Provides various helpful functions, such as log.info.

Your init function should keep sathyaServerState and sathyaHelpers stored in a local variable, so it can be accessed outside init() in your module.

## sathyaServerState
The ServerState is a fundamental concept in Sathya. It is a JS object accessible and modifiable by Sathya and it's Modules.
It is persisted to disk, and loaded every time the server starts. Think of it like the "database++" of SathyaServer.

Since the state is simply a JS object, you can store whatever you want in it.
Never create methods or properties in the root level of the state object, create your own object (`state.Your_Module.whatever`)!

### Working with the ServerState
The ServerState class provides two main methods: setState and state.

setState allows you to manipulate the state. For example, if you want to create a new property "Hello":
```javascript
ServerState.setState(
    {
        "Hello": "World"
    }
);
```

setState simply takes the object you pass as an argument, and *merges* it with the existing state (behind the scenes, this is done using the lodash _.merge() function).

> This means that setState will create a new property in the state if it does not exist, or replace an existing property with the new value passed. Unlike the ES ...spread operator, the lodash merge function performs a deep merge.

setState is also an async function, so you can await it as well (or pass a callback instead).

**The `ServerState.getState()` function will return the current state object.**
If you need to directly manipulate the state (though this is discouraged), you can access it at `ServerState.state`.

Your module should **only** modify it's own state "sub-object". Modules should only interact with each other through exposed 
API's on the state.

#### Temporary State
Sathya also provides a temporary state that is cleared every shutdown. This is useful for storing state that doesn't need 
to be persisted to disk. The state is available at `ServerState.getState().tmp`.

Sathya also provides the `ServerState.getTmpState()` and `ServerState.setTmpState()` utility functions, where the root 
state is set to the tmp object.

### Interaction using the ServerState (Creating a Module API)
Thus far we have only looked at the state that stores JS properties, i.e simple values. However, the ServerState has another, very useful, feature: Exposing JS Functions as methods in the state.

This particularly useful for *inter-module* interaction. That is, modules (and Sathya itself), can expose their own API using the server state.

Take the Hello Module for example. Let's assume it contains a function HelloWorld() that returns some string value. The module can expose this function as follows:
```javascript

function HelloWorld() {
    return "Hello World!";
}

ServerState.setState(
    {
        HelloModule: {
            API: {
                HelloWorldFunction: HelloWorld
            }
        }
    }  
);
```

In this example, the HelloWorld function is exposed at `ServerState.getState().HelloModule.API.HelloWorldFunction()`.

**Note:** When the state gets saved to disk, it becomes a JSON string using JSON.stringify. This means that while properties are saved, methods are not. Your module should recreate methods in the state every time the server starts.

### Keep the ServerState Clean!
Because the ServerState is used so heavily in a Sathya server, it can become quite large very quickly. It's up to the Module to prevent it's section of the state from becoming filled with garbage.

An key concept is a Module should split it's state into temp state and permanent state. Modules should clear the temp state during startup and shutdown.

### Deleting State Properties
A common situation is to delete certain properties from the state (see above). The ServerState has a `delState()` function that can be used in two ways.
The first behaviour of delState is when you want to delete a "root property". Root properties are properties/methods/objects that are not nested within any object in the state.
```javascript
ServerState.delState('HelloModule');
```
This will delete the HelloModule root property/object. Now let's say you want to remove the HelloWorldFunction method.
```javascript
ServerState.delState('HelloWorldFunction', 'HelloModule.API');
```
The first argument is the property to delete, and the second is where in the state (relative to root) the property is.

## Writing Modules in Java
Sathya's Runtime is GraalVM. Graal is a so called "polyglot" virtual machine, which means it's capable of running multiple languages. 
While Sathya itself is written is JavaScript, it runs on GraalJS, and thus can co-operate with different languages.

Notably, since GraalJS is written in Java and runs on the JVM, Sathya modules can make use of Java in a few different ways.

> This is a good time to note: JavaScript (JS) is not Java!
> Another nice feature is that you can use any JVM-based language: Scala, Groovy, Kotlin, Clojure, etc.
### Writings Modules in JS, but using Java libraries.
The Java ecosystem comes with a number of useful and performant libraries, many of which are included in OpenJDK.
While writing a Sathya module, you may find it useful to be able to call Java methods, whether it be to use a feature not easily available in JS, or to perform compute heavy tasks.

> In some cases, Java can be several times faster than JS.

As an example, let's use the BigInteger library. Calling BigInteger is as easy as:
```javascript
var BigInteger = Java.type('java.math.BigInteger');
console.log(BigInteger.valueOf(2).pow(100).toString(16));
```
The first line is essentially a "require" line, except instead of a Node Module, it's a Java Class.
From there on, you can call BigInteger as if it were a native JS function!
### Writing Modules in Java
As you saw in the previous example, Classes can be called from JS. Thus, you can write your own Java classes, add them to your module directory, and call them from JS. 

> You will, at minimum, still need a Main.js file to call your Java code. Further, you will need to continue to use JS to interact with the rest of Sathya, since features like the ServerState are only available in the JS layer. A good practice with Java interop is write chunks of business logic in Java as various methods, and have them "glued" together in JS. This way, your Java methods can pass data through the JS layer and interact with the rest of Sathya.

The JVM class path is set to the Modules directory, so a Main.java file in the HelloJava module can be accessed at the class HelloJava.Main

You can learn more about JavaInterop here: https://github.com/graalvm/graaljs/blob/master/docs/user/JavaInterop.md

## Sathya Polyglot
Like the above examples using Java, Thanks to GraalVM, Sathya Modules can also interop with a number of additional languages.
* Python
* Ruby
* R
* LLVM (C/C++)
and potentially more.

For example, to call an R function from your Module:
```javascript
console.log(Polyglot.eval('R', 'runif(100)')[0]);
// = 0.8198353068437427
```

You can learn more about Graal Polyglot here: https://www.graalvm.org/docs/reference-manual/polyglot/

## Config
As a module writer you have the freedom to choose a persistent config for you module.

SathyaServer provides two systems out of the box: The ServerState, and the config.ini file.

The State is a good choice for config where you need something that can be easily modified in software, 
and is persisted to disk. The downside is there is no default way for a user to modify the state, your module will 
have to provide that.

The config.ini file is loaded during the server startup. It's easily accessed through the state (`ServerState.getState().ini_config.YOUR_MODULE`), 
and is easily modified by the user. The downside is you cannot modify the config.ini using setState, it can only be 
edited offline/externally (this could be a plus).

The third option you have is to bring your own config. Feel free to do whatever you want in your module's directory.

## Databases
Sathya comes with SathyaDB, a full SQL database with async/await support.
> Behind the scenes, SathyaDB uses sqlite. Since sqlite uses a native C++ driver, and we include additional JS caching, it is quite performant.

The database is exposed at `ServerState.getState().SQL.db`.

To run a SQL Query:
```javascript
let SQL = ServerState.getState().NodeModules.sql_template;
let db = ServerState.getState().SQL.db;
async function doSomeSQLQuery() {
    const data = await db.all(SQL`SELECT author FROM books WHERE name = ${book} AND author = ${author}`);
}
```
You may have noticed the import for `sql_template`. This is a useful module that lets you use ES6 tagged strings (letting you do `${book}`) to easily create prepared statements.

You can read more about the SQLite API at: https://github.com/kriasoft/node-sqlite and at: https://github.com/mapbox/node-sqlite3/

Besides using SathyaDB, your module is free to require external databases (MySQL, Postgre, MSSQL, Redis, Mongo, etc).
> It's also worth noting that the ServerState itself is sufficient as a "NoSQL" database. SathyaDB is great when you need a relational DB.

## Background Services
SathyaServer provides a service to regularly call a function in your module. For example, this is used in the Integrity 
module to keep the server stats up to date in the ServerState.

The BackgroundServices modules provides a function to register a new background task.
```javascript
serverState.getState().BackgroundServices.registerBackgroundTask(
    {
        name: "Integrity Module - System Stats",
        task: (serverState) => {
            console.log("This is a background service!");
        }
    }
);
```
The `registerBackgroundTask()` function accepts a task object as an argument (which is the name of the task, and the 
actual function to call).

The frequency of background tasks being called is defined in the `config.ini`.

## Exported Node Modules
SathyaServer provides a few useful Node Modules through the ServerState (`ServerState.getState().NodeModules`) for 
other modules to use.

Module | Export 
--- | ---
[Lodash](https://lodash.com/) | `NodeModules.lodash` 
[Moment](https://momentjs.com/) | `NodeModules.moment`
[Chalk](https://github.com/chalk/chalk) | `NodeModules.chalk`
[ini](https://www.npmjs.com/package/ini) | `NodeModules.ini`
[System Information](https://www.npmjs.com/package/systeminformation) | `NodeModules.systeminformation`
[Express](https://expressjs.com/) | `NodeModules.express`
[Express CORS](https://expressjs.com/en/resources/middleware/cors.html) | `NodeModules.cors`
[Node SQLite](https://github.com/kriasoft/node-sqlite) | `NodeModules.sqlite`
[SQL Template Strings](https://github.com/felixfbecker/node-sql-template-strings) | `NodeModules.sql_template`

## Disabling Modules
The `DisabledModules` file in the Modules folder contains a list of Modules that should not be loaded (line separated).

## Sathya PubSub
Sathya provides a simple Node EventEmitter instance through the state.

The instance is exposed at `ServerState.getState().pubsub`.

To register a listener:
```javascript
serverState.getState().pubsub.on('sathya-shutdown', () => {
    log.info('Clearing Background Services...');
    clearInterval(interval);
});
```

To fire an event:
```javascript
serverState.getState().pubsub.emit('sathya-shutdown');
```

