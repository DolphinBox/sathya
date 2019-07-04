let serverState;
let helpers;
let fs = require('fs');


function init(sathyaServerState, sathyaHelpers) {
    serverState = sathyaServerState;
    helpers = new sathyaHelpers('SathyaServer Shutdown Handler');

    // Register the ShutdownHandler
    process.stdin.resume();
    process.on('exit', shutDownSequence);
    process.on('SIGINT', () => process.exit(2));
    process.on('SIGUSR1', () => process.exit(2));
    process.on('SIGUSR2', () => process.exit(2));
}

function shutDownSequence() {
    helpers.log.info('---------------------------------------');
    helpers.log.info('~ SathyaServer is shutting down... ~');

    // Todo: call all the modules with type shutdown

    helpers.log.info('Saving the ServerState...');
    fs.writeFileSync('sathya-serverstate.json', JSON.stringify(serverState.getState()), 'utf8');

    helpers.log.info('Goodbye!');
    helpers.log.info('---------------------------------------');
}

module.exports = init;