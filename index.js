console.log('~ Starting Sathya ~');

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

log.info('Loaded Core Modules!');

// Server Startup Functions.
async function checkSystemIntegrity(callback) {
    await serverIntegrityModule(serverState);
    callback();
}
function saturateServerState(callback) {
    callback();
}
function loadExternalModules(callback) {
    let extModules = []; // Array of module init functions.
    const { readdirSync, statSync } = require('fs');
    const { join } = require('path');

    // This one-liner is a function dirs() that returns an array of folders,
    const dirs = p => readdirSync(p).filter(f => statSync(join(p, f)).isDirectory());
    let moduleList = dirs('./Modules');

    for(let i = 0; i < moduleList.length; i++) {
        log.info(' -> Loading Module: ' + moduleList[i]);
        extModules[i] = require('./Modules/' + moduleList[i] + '/Main');
    }

    log.info('Starting External Modules... Please don\'t crash!');
    for(let i = 0; i < extModules.length; i++) {
        // Call the modules init function passing the server state.
        log.info(' -> Starting Module: ' + moduleList[i]);
        try {
            extModules[i]('START', serverState, require('./CoreModules/Helpers.js'));
        } catch(e) {
            log.error('   -> Module ' + moduleList[i] + ' has run into an error while starting: ' + e);
            console.error(e.stack);
        }
    }

    callback();
}

// ~ Main Server Startup Sequence ~
function serverStartup() {
    log.info('Checking the System Integrity...');
    // Begin System Integrity Check.
    checkSystemIntegrity(
        () => {
            // Saturate the server state from disk.
            log.info('Loading Server State...');
            saturateServerState(
                () => {
                    // Begin Loading Modules.
                    log.info('Loading External Modules...');
                    loadExternalModules(
                        () => {
                            log.info('Done Loading External Modules!');

                            log.info('~ Sathya Server has started!');
                        });
                });
        });
}
serverStartup();


