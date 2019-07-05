let serverState;
let helpers;


function HelloWorld() {
    return "Hello World";
}

function init(action, sathyaServerState, sathyaHelpers) {
    if(action === 'START') {
        serverState = sathyaServerState;
        helpers = new sathyaHelpers('Hello');

        // Register the "Hello World API"
        serverState.setState(
            {
                HelloModule: {
                    API: {
                        HelloWorldFunction: HelloWorld
                    }
                }
            }
        );

        setTimeout(() => {
            helpers.log.info(JSON.stringify(serverState.getState()));
            helpers.log.info(serverState.getState().HelloModule.API.HelloWorldFunction());
        }, 2000);
    } else {
        helpers.log.info('Goodbye World!')
    }

}
module.exports = init;