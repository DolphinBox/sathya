// Stores the global state of the Sathya server. I can imagine this being a messy thing.
let _ = require('lodash');

class ServerState {
    constructor() {
        // The magical state
        this.state = {
            tmp: {} // Create the tmp state.
        }
    }

    // Function manipulate state (Don't mutate it directly)
    // Eventually this should be smart enough to prevent collisions using a queue or something.
    async setState(newState, callback) {
        //this.state = {...this.state, ...newState};
        this.state = _.merge(this.state, newState);
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
    async setTmpState(newState, callback) {
        //this.state = {...this.state, ...newState};
        this.state = _.merge(this.state.tmp, newState);
        if (callback && typeof callback === 'function') {
            callback();
        }
    }

    // "getters"
    getState() {
        return this.state;
    }
    getTmpState() {
        return this.state.tmp;
    }

    delState(property, state) {
        if(typeof state == 'undefined') {
            // Delete this root property
            delete this.state[property];
        } else {
            // This is not a root property, delete using eval.
            delete eval('this.state.' + state)[property];
        }
    }


}

// Create a new instance of the server state to provide.
let serverState = new ServerState();

module.exports = serverState;