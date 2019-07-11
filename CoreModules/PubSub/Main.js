const Helpers = require('../Helpers');
const log = new Helpers('SathyaPubSub').log;

// This CoreModules provides a PubSub event system.
let events = require('events');
let pubsub = new events.EventEmitter();

let serverState;

async function SathyaPubSub(sathyaServerState) {
    serverState = sathyaServerState;

    // Clear the state first...
    serverState.delState('pubsub');

    // Add the pubsub to the state.
    await serverState.setState (
        {
            pubsub: pubsub
        }
    );

    log.info('Created new PubSub!');
}

module.exports = SathyaPubSub;