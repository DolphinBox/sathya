const Helpers = require('../Helpers');
const log = new Helpers('SathyaDB').log;

// This CoreModules provides a CLI
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let commands = [
];

let serverState;
let _;
let yargs;

async function SathyaShell(sathyaServerState) {
    serverState = sathyaServerState;

    // Wait for the server to startup.
    let hasServerStarted = setInterval(() => {
        if(serverState.getTmpState().SathyaServer.hasStarted) {

            // Load Node Modules
            _ = serverState.getState().NodeModules.lodash;
            yargs = serverState.getState().NodeModules.yargs;

            // Register some commands:
            commands.push(
                {
                    cmd: 'stop',
                    func: async (args) => {
                        process.kill(process.pid, "SIGINT");
                    }
                }
            );
            commands.push(
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

            serverState.setState({
                SathyaShell: {
                    registerCommand: registerCommand,
                    deregisterCommand: deregisterCommand
                }
            });

            startShell();
            clearInterval(hasServerStarted);
        }
    }, 1000);

    log.info('Started SathyaShell!');
}

function startShell() {
    readline.question(`Sathya $ `, (cmd) => {
        handleCommand(cmd).then(() => {
            startShell();
        });
    });
}

async function handleCommand(cmd) {
    // Use Yargs to parse the command.
    let args = yargs.parse(cmd);
    console.log(args);

    let cmdObj = _.find(commands, (o) => { return o.cmd === args._[0]; });

    // Fire an event that a command has been executed.
    serverState.getState().pubsub.emit('sathyashell-command', cmdObj);

    if (typeof cmdObj !== 'undefined') {
        await cmdObj.func(args);
    } else {
        console.log('Unknown Command')
    }
}

function registerCommand(cmdObj) {
    // Find if there is a command with that name already.
    let conflictCmd = _.find(commands, (o) => { return o.cmd === args._[0]; });

    if (typeof conflictCmd !== 'undefined') {
        // Error: there is already a cmd.
        return false;
    } else {
        commands.push(cmdObj);
        return true;
    }
}

function deregisterCommand(cmdString) {
    _.remove(commands, (o) => { return o.cmd === cmdString });
    return true;
}

module.exports = SathyaShell;