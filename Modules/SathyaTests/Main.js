let ServerState;
let helpers;
let log;

// Test Cases
let testSathyaState = require('./Cases/State');

// This module provides internal testing of Sathya.

async function init(action, sathyaServerState, sathyaHelpers) {
    if(action === 'START') {
        ServerState = sathyaServerState;
        helpers = new sathyaHelpers('Sathya Tests');
        log = helpers.log;

        log.info('~~ THIS SERVER IS RUNNING THE SATHYA QA/TEST SUITE ~~');
        log.info('Waiting for server to finish starting up...');

        // Wait for the server to finish starting up.
        let interval = setInterval(async () => {
            if(ServerState.getTmpState().SathyaServer.hasStarted) {
                clearInterval(interval);
                startTestSuite();
            }
        }, 1000);

    } else {
        helpers.log.info('Goodbye!');
    }

}

async function startTestSuite() {
    log.info('~~ STARTING SATHYA TEST SUITE ~~');

    log.info('Testing ServerState...');
    let stateResult = await testSathyaState(ServerState, log);
    if(stateResult.SetGetMultiLevel && stateResult.SetGetSingleLevel) {
        log.info('ServerState tests passed!');
    } else {
        log.info('ServerState tests DID NOT pass!')
    }
}

module.exports = init;