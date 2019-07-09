const Helpers = require('../Helpers');
const log = new Helpers('SathyaDB').log;

// This CoreModules provides a SQLite Database.


let serverState;
let SQL;
let sqlite;

let db;

async function SathyaDB(sathyaServerState) {
    serverState = sathyaServerState;
    SQL = serverState.getState().NodeModules.sql_template;
    sqlite = serverState.getState().NodeModules.sqlite;

    // Clear the state first...
    serverState.delState('SQL');

    // Open the Database from disk.
    db = await sqlite.open('./sathyadb.sqlite', { cached: true });

    // Add the register method to the state.
    await serverState.setState (
        {
            SQL: {
                db: db
            }
        }
    );

    log.info('Started SathyaDB!');
}

module.exports = SathyaDB;