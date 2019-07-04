# Sathya Module API
Plugins for Sathya are designed as CommenJS (Node) modules.

Plugins must be contained in a folder in the "Modules" directory.
The entry point for a module is the Main.js file.

## Main.js spec
There are two requirements for the Main.js file.
* An `init(action, sathyaServerState, sathyaHelpers) {}` function.
* The init function exported (`module.exports = init;`)

The init function is called by Sathya during the startup or shutdown of the server.

Sathya passes three parameters to init:
* action: A string that specifies whether init is being called during startup or shutdown.
  * Values: "START", "STOP"
* sathyaServerState: an instance of the global ServerState class. This gives you access to the getState and setState functions.
* sathyaHelpers: an instance of the Helpers core module. Provides various helpful functions, such as log.info.

Your init function should keep sathyaServerState and sathyaHelpers stored in a local variable, so it can be accessed outside init() in your module.

## sathyaServerState
The ServerState is a fundemental concept in Sathya. It is a JS object accessible and modifiable by Sathya and it's Modules.
It is persisted to disk, and loaded every time the server starts.

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

setState simply takes the object you pass as an argument, and *merges* it with the existing state (behind the scenes, this is accomplished with the ... spread operator).

This means that setState will create a new property in the state if it does not exist, or replace an existing property with the new value passed.

In order to get the current state: `ServerState.state()`. This method simply returns the current state object.


### Interaction using the ServerState ("Creating an API")
Thus far we have only looked at the state storing JS properties, i.e simple values. However, the ServerState has another, very useful, feature: Exposing JS Functions as methods in the state.

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

In this example, the HelloWorld function is exposed at `ServerState.HelloModule.API.HelloWorldFunction()`.

**Note:** When the state gets saved to disk, it becomes a JSON string using JSON.stringify. This means that while properties are saved, methods are not. Your module should recreate methods in the state everytime the server starts.

### Keep the ServerState Clean!
Because the ServerState is used so heavily in a Sathya server, it can become quite large very quickly. It's up to the Module to prevent it's section of the state from becoming filled with garbage.

An key concept is a Module should split it's state into temp state and permanent state. Modules should clear the temp state during startup and shutdown.

## Writing Modules in Java
Sathya's Runtime is GraalVM. Graal is a so called "polyglot" virtual machine, which means it's capable of running multiple languages. 
While Sathya itself is written is JavaScript, it runs on GraalJS, and thus can co-operate with different languages.

Notably, since GraalJS is written in Java and runs on the JVM, Sathya modules can make use of Java in a few different ways.
### Writings Modules in JS, but using Java libraries.
The Java ecosystem comes with a number of useful and performant libraries, many of which are included in OpenJDK.
While writing a Sathya module, you may find it useful to be able to call Java methods, whether it be to use a feature not easily available in JS, or to perform compute heavy tasks.

As an example, let's use the BigInteger library. Calling BigInteger is as easy as:
```javascript
var BigInteger = Java.type('java.math.BigInteger');
console.log(BigInteger.valueOf(2).pow(100).toString(16));
```
The first line is essentially a "require" line, except instead of a Node Module, it's a Java Class.
From there on, you can call BigInteger as if it were a native JS function!
### Writing Modules in Java
As you saw in the previous example, Classes can be called from JS. Thus, you can write your own Java classes, add them to your module directory, and call them from JS.

The JVM class path is set to the Modules directory, so a Main.java file in the HelloJava module can be accessed at the class HelloJava.Main

Todo: document this further.

You can learn more about JavaInterop here: https://github.com/graalvm/graaljs/blob/master/docs/user/JavaInterop.md