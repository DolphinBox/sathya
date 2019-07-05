const Helpers = require('../Helpers');
const log = new Helpers('Background Service Provider').log;

// This CoreModules allows Modules to register a task that will be called on a regular interval.

// {name:"", task: function}

let serverState;


function registerBackgroundTask(taskObj) {
    serverState.state.BackgroundServices.registeredTasks.push(taskObj);
}

function runBackgroundTasks() {
    // loop over each registered task.
    for(let i = 0; i < serverState.getState().BackgroundServices.registeredTasks.length; i++) {
        let task = serverState.getState().BackgroundServices.registeredTasks[i];
        //log.info('Calling Background Task "' + task.name + '"...');
        task.task(serverState);
    }
}

async function backgroundServicesModule(sathyaServerState, ini_config) {
    serverState = sathyaServerState;

    // Clear the state first...
    serverState.delState('BackgroundServices');

    // Add the register method to the state.
    await serverState.setState (
        {
            BackgroundServices: {
                registerBackgroundTask: registerBackgroundTask,
                registeredTasks: []
            }
        }
    );

    // Call the background tasks at a regular interval.
    setInterval(runBackgroundTasks, ini_config.sathyaserver.background_interval);
    log.info('Started Background Services Module!');
}

module.exports = backgroundServicesModule;