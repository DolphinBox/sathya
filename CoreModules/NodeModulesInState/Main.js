const Helpers = require('../Helpers');
const log = new Helpers('Node Modules Provider').log;

// This CoreModules exposes useful Node Modules in the state.


let serverState;


async function NodeModulesInState(sathyaServerState) {
    serverState = sathyaServerState;

    // Clear the state first...
    serverState.delState('NodeModules');

    log.info('Loading Node Modules...');
    const lodash = require('lodash');
    const moment = require('moment');
    const chalk = require('chalk');
    const ini = require('ini');
    const systeminformation = require('systeminformation');

    const express = require('express');
    const cors = require('cors');

    const sqlite = require('sqlite');
    const sql_template = require('sql-template-strings');

    const shell = require('shelljs');

    const yargs = require('yargs');

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
                cors: cors,
                sqlite: sqlite,
                sql_template: sql_template,
                shell: shell,
                yargs: yargs
            }
        }
    );

    log.info('Registered Node Modules in the state!');
}

module.exports = NodeModulesInState;