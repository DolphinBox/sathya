# SathyaShell
When you start Sathya, you'll notice a prompt like this:

```bash
Sathya $ 
```

This is the Sathya Shell. Like a Linux shell, it has commands that you can execute to perform various tasks.

There are a number of built in commands, and Modules can register their own commands.

> This feature is not available in Beta 1.

## Built-In commands
Command | Arguments | Description 
--- | --- | ---
stop | None | Stops the server (SIGINT)
get | modules | "modules": prints the loaded modules.

## Registering a Command
Modules can register their own commands into SathyaShell:

```javascript
ServerState.getState().SathyaShell.registerCommand(
    {
        cmd: 'get',
        func: async (args) => {
            if(args._.length <= 1) {
                console.log('get subcommands:');
                console.log('-> modules')
            } else {
                switch(args._[1]){
                    case "modules":
                        console.log(serverState.getState().moduleList);
                        break;
                    default:
                        console.log('Unknown get command');
                }
            }
        }
    }
);
```

The `registerCommand(cmdObj)` method adds a new command object to SathyaShell. A command object consist of:
* The Command Name
* The Command Function
```javascript
let cmdObj = { cmd: "some-command", func: (args) => {} }
```

SathyaShell passes an `args` argument to the function. SathyaShell uses the [yargs](https://github.com/yargs/yargs) utility to 
parse the command arguments. Thus, `args` is the resultant object from Yargs.

`args` looks something like this:
```javascript
// The command "get modules" gives us
{ _: [ 'get', 'modules' ], '$0': 'index.js' }
```
You can ignore `$0`. The `_` object property contains the array of commands + arguments. `_[0]` will always be the 
actual command executed, and every element after that is an argument passed to the command (for example, `_[1]` is "modules").

Let's look at a more complex example:
```javascript
// The command " set server-state --state="Something pretty cool" " gives us
{ _: [ 'set', 'server-state' ],
  state: 'Something pretty cool',
  '$0': 'index.js' }
```

Notice that the `--state="Something pretty cool"` argument becomes a property of `args` (`args.state`)!