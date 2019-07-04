let serverState;
let helpers;

function init(action, sathyaServerState, sathyaHelpers) {
    serverState = sathyaServerState;
    helpers = new sathyaHelpers('Hello');

    setTimeout(() => {
        helpers.log.info(JSON.stringify(serverState.getState()));
    }, 2000);
}
module.exports = init;