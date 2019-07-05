const si = require('systeminformation');
const Helpers = require('../Helpers');
const log = new Helpers('SathyaServer').log;

// AKA The System Information Module

async function serverIntegrityModule(serverState) {
    // Basically make sure the server is OK
    // -> Is it running on supported hardware?
    // -> probe the hardware and check if everythings ok (SMART, etc)
    // -> make sure all Sathya files are there (checksum it too?)
    // etc

    // Also Populate the state with system information

    let systemInfo = {};

    try {
        const cpuInfo = await si.cpu();
        log.info(' -> Running on a ' + cpuInfo.manufacturer + ' ' + cpuInfo.brand);
        systemInfo.cpu = cpuInfo.manufacturer + ' ' + cpuInfo.brand;
        const osInfo = await si.osInfo();
        if(osInfo.platform === "linux" || osInfo.platform === "darwin") {
            log.info(' -> Supported Environment: ' + osInfo.distro + ' (' + osInfo.platform + ')');
        } else {
            log.info(' -> Unsupported Environment: ' + osInfo.distro + ' (' + osInfo.platform + ')');
        }
        systemInfo.os = osInfo.distro + ' (' + osInfo.platform + ')';
        if (typeof Graal != 'undefined') {
            log.info(' -> Supported Environment: GraalJS ' + Graal.versionJS + '  GraalVM ' + Graal.versionGraalVM);
            log.info('   -> Graal Emulating: Node ' + process.version + ' / V8 ' + process.versions.v8);
            systemInfo.runtime = 'Graal ' + Graal.versionJS;
        } else {
            log.info(' -> Unsupported Environment: Node ' + process.version + ' / V8 ' + process.versions.v8);
            systemInfo.runtime = 'Node ' + process.version;
        }

        // Save the system info to the state.
        await serverState.setState({ systemInfo: systemInfo });

        // Set a background service to update some server stats.
        /*serverState.getState().BackgroundServices.registerBackgroundTask(
            {
                        name: "Integrity Module - System Stats",
                        task: ()=> {
                                console.log("THIS IS A BACKGROUND SERVICE!!!");
                        }
                    }
            );*/

        return;
    } catch (e) {
        console.log(e)
    }
}

module.exports = serverIntegrityModule;