let serverState;
let helpers;

async function init(action, sathyaServerState, sathyaHelpers) {
    if(action === 'START') {
        serverState = sathyaServerState;
        helpers = new sathyaHelpers('HelloC');

        // Calling C code from Sathya

        let helloc = Polyglot.evalFile("llvm", __dirname + "/hello.bc");
        helloc.main();
    } else {
        helpers.log.info('Goodbye C!');
    }

}
module.exports = init;