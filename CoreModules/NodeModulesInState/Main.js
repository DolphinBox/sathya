const Helpers = require('../Helpers');
const log = new Helpers('Node Modules Provider').log;

// This CoreModules exposes useful Node Modules in the state.


let serverState;


async function NodeModulesInState(sathyaServerState) {
    serverState = sathyaServerState;

    // Clear the state first...
    serverState.delState('NodeModules');

    // Add the register method to the state.
    await serverState.setState (
        {
            NodeModules: {
                lodash: require('lodash'),
                moment: require('moment'),
                chalk: require('chalk'),
                ini: require('ini'),
                systeminformation: require('systeminformation')
            }
        }
    );

    log.info('Registered Node Modules in the state!');
}

module.exports = NodeModulesInState;