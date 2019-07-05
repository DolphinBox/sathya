console.log('~ Starting Sathya ~');

// Time the server startup.
let startTime = process.hrtime();

// Load Core Modules
console.log('Loading Core Modules...');

// Register the Crash Handler
require('./CoreModules/CrashHandler/Main')();

// Load Helpers and create a new log instance
const Helpers = require('./CoreModules/Helpers');
const log = new Helpers('SathyaServer').log;

// Create the state object
const serverState = require('./CoreModules/State/Main');

// Load the integrity module
const serverIntegrityModule = require('./CoreModules/Integrity/Main');

// Register the Shutdown Handler
require('./CoreModules/ShutdownHandler/Main')(serverState, require('./CoreModules/Helpers.js'));

let fs  = require('fs');
let ini = require('ini');

// Load the INI config.
var ini_config = ini.parse(fs.readFileSync('./config.ini', 'utf-8')).sathyaserver;

log.info('Loaded Core Modules!');

// Server Startup Functions.
async function checkSystemIntegrity() {
    await serverIntegrityModule(serverState);
}
async function saturateServerState() {
    let previousState = await JSON.parse(fs.readFileSync('sathya-serverstate.json','utf8'));
    await serverState.setState(previousState);
}

async function loadExternalModules() {
    //let extModules = []; // Array of module init functions.
    // Store the extModules in the state.
    serverState.setState({ extModules: [] });

    const { readdirSync, statSync } = require('fs');
    const { join } = require('path');

    // This one-liner is a function dirs() that returns an array of folders,
    const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());
    let moduleList = dirs('./Modules');

    await serverState.setState({moduleList: moduleList});

    for(let i = 0; i < moduleList.length; i++) {
        log.info(' -> Loading Module: ' + moduleList[i]);
        serverState.state.extModules[i] = require('./Modules/' + moduleList[i] + '/Main');
    }

    log.info('Starting External Modules... Please don\'t crash!');
    for(let i = 0; i < serverState.state.extModules.length; i++) {
        // Call the modules init function passing the server state.
        log.info(' -> Starting Module: ' + moduleList[i]);
        try {
            await serverState.state.extModules[i]('START', serverState, require('./CoreModules/Helpers.js'));
        } catch(e) {
            log.error('   -> Module ' + moduleList[i] + ' has run into an error while starting: ' + e);
            console.error(e.stack);
        }
    }
}

// ~ Main Server Startup Sequence ~
async function serverStartup() {

    // Saturate the server state from disk.
    log.info('Loading Server State...');
    await saturateServerState();
    log.info('Populating INI Config...');
    serverState.delState('ini_config'); // Delete the old ini_config from state.
    await serverState.setState({ini_config: ini_config}); //  Store it in the state.

    log.info('Checking the System Integrity...');
    // Begin System Integrity Check.
    await checkSystemIntegrity();

    // Begin Loading Modules.
    log.info('Loading External Modules...');
    await loadExternalModules();

    log.info('Done Loading External Modules!');
}

// Start the server!
serverStartup().then(()=> {
    let endTime = process.hrtime(startTime);
    log.info('~ Sathya Server has started! (' + endTime[0] + 's ' + endTime[1] / 1000000 + 'ms)');
});


