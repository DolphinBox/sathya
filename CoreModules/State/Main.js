// Stores the global state of the Sathya server. I can imagine this being a messy thing.

class ServerState {
    constructor() {
        // The magical state
        this.state = {
            hello: "Hey!"
        }
    }

    // Function manipulate state (Don't mutate it directly)
    // Eventually this should be smart enough to prevent collisions using a queue or something.
    setState(newState, callback) {
        this.state = {...this.state, ...newState}
        callback();
    }

    // "getters"
    getState() {
        return this.state;
    }


}

// Create a new instance of the server state to provide.
let serverState = new ServerState();

module.exports = serverState;