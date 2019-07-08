let serverState;
let helpers;
let log;

async function init(action, sathyaServerState, sathyaHelpers) {
    if(action === 'START') {
        serverState = sathyaServerState;
        helpers = new sathyaHelpers('Fluid');
        log = helpers.log;

        log.info('Starting Fluid services...');

    } else {
        log.info('Fluid has shutdown.');
    }

}
module.exports = init;