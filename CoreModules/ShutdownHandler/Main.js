let serverState;
let helpers;
let fs = require('fs');
let nodeCleanup = require('node-cleanup');


function init(sathyaServerState, sathyaHelpers) {
    serverState = sathyaServerState;
    helpers = new sathyaHelpers('SathyaServer Shutdown Handler');

    // Register the ShutdownHandler
    nodeCleanup((exitCode, signal) => {
        // nodeCleanup will capture all exit events, then call this function.
        // shutDownSequence is async, so we call it, and then tell nodeCleanup
        // that we will stop the process ourselves (otherwise when we try to exit
        // when our async things are complete, nodeCleanup will call it again,
        // causing an infinite loop).
        let promise = shutDownSequence(exitCode, signal);
        nodeCleanup.uninstall(); // Unregister the nodeCleanup handler.
        return false;
    });

    serverState.setState({
        shutDownSequence: shutDownSequence
    });

    helpers.log.info('Started Shutdown Handler Module!');
}

async function shutDownSequence(exitCode, signal) {
    helpers.log.info('---------------------------------------');
    helpers.log.info('~ SathyaServer is shutting down (' + exitCode + ' ' + signal + ')... ~');

    // Set a shutdown timeout, in case a module hangs.

    helpers.log.info('Shutdown timeout set to ' + serverState.getState().ini_config.sathyaserver.shutdown_timeout);
    setTimeout(() => {
        helpers.log.warn('Reached shutdown timeout!');
        process.kill(process.pid, signal);
    }, serverState.getState().ini_config.sathyaserver.shutdown_timeout);

    helpers.log.info('Shutting Down ' + serverState.state.extModules.length + ' Modules...');
    for(let i = 0; i < serverState.state.extModules.length; i++) {
        // Call the modules init function passing the server state.
        helpers.log.info(' -> Stopping Module: ' + serverState.getState().moduleList[i]);
        try {
            await serverState.state.extModules[i]('STOP');
        } catch(e) {
            helpers.log.error('   -> Module ' + serverState.getState().moduleList[i] + ' has run into an error while stopping: ' + e);
            console.error(e.stack);
        }
    }

    helpers.log.info('Sending shutdown event...');
    serverState.getState().pubsub.emit('sathya-shutdown');

    helpers.log.info('Stopping SathyaDB...');
    serverState.getState().SQL.db.close();

    helpers.log.info('Cleaning Up...');

    // Keep the INI before we clear it
    let ini_config = serverState.getState().ini_config;

    // SathyaServer states.
    serverState.delState('BackgroundServices');
    serverState.delState('NodeModules');
    serverState.delState('extModules');
    serverState.delState('moduleList');
    serverState.delState('pubsub');
    serverState.delState('SQL');
    serverState.delState('ini_config');
    // Delete tmp state
    serverState.delState('tmp');

    helpers.log.info('Saving the ServerState...');
    fs.writeFileSync(ini_config.sathyaserver.persist_state_file, JSON.stringify(serverState.getState(), null, 4), 'utf8');

    helpers.log.info('Pausing to let processes clean up...');
    setTimeout(() => {
        helpers.log.info('Goodbye!');
        helpers.log.info('---------------------------------------');

        process.kill(process.pid, signal);
    }, 4000);
}

module.exports = init;