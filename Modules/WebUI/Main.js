let express;
let cors;
const path = require('path');

let serverState;
let helpers;
let log;

let app; // = express();
let server;

async function init(action, sathyaServerState, sathyaHelpers) {
    if(action === 'START') {
        // Map the state provider and helpers to local variables.
        serverState = sathyaServerState;
        helpers = new sathyaHelpers('WebUI');

        // Start express
        express = serverState.getState().NodeModules.express;
        cors = serverState.getState().NodeModules.cors;
        app = express();

        // Express middleware
        app.use(cors());
        app.use(express.json());
        app.use(express.static(path.join(__dirname, 'sathya-ui/build')));

        /* REST API for ServerState */
        app.get('/api/v1/state', (req, res) => {
            res.send(JSON.stringify(serverState.getState()));
        });
        app.post('/api/v1/state', (req, res) => {
            try {
                serverState.setState(req.body, () => {
                    res.send('OK');
                });
            } catch(e) {
                res.send('ERROR: ' + e);
            }

        });

        // Create a seperate file for more routes.

        let port = serverState.getState().ini_config.webui.port;

        server = await app.listen(port);
        helpers.log.info(`Sathya WebUI listening on port ${port}!`)


    } else {
        helpers.log.info('WebUI is shutting down...');
        server.close();
    }

}

module.exports = init;
