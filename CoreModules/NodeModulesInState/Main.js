const Helpers = require('../Helpers');
const log = new Helpers('Node Modules Provider').log;

// This CoreModules exposes useful Node Modules in the state.


let serverState;


async function NodeModulesInState(sathyaServerState) {
    serverState = sathyaServerState;

    // Clear the state first...
    serverState.delState('NodeModules');

    log.info('Loading Node Modules...');
    let lodash = require('lodash');
    let moment = require('moment');
    let chalk = require('chalk');
    let ini = require('ini');
    let systeminformation = require('systeminformation');

    let express = require('express');
    let cors = require('cors');

    // Add the register method to the state.
    await serverState.setState (
        {
            NodeModules: {
                lodash: lodash,
                moment: moment,
                chalk: chalk,
                ini: ini,
                systeminformation: systeminformation,
                express: express,
                cors: cors
            }
        }
    );

    log.info('Registered Node Modules in the state!');
}

module.exports = NodeModulesInState;