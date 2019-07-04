const si = require('systeminformation');
const Helpers = require('../Helpers');
const log = new Helpers('SathyaServer').log;


async function serverIntegrityModule(serverState) {
    // Basically make sure the server is OK
    // -> Is it running on supported hardware?
    // -> probe the hardware and check if everythings ok (SMART, etc)
    // -> make sure all Sathya files are there (checksum it too?)
    // etc

    try {
        const cpuInfo = await si.cpu();
        log.info(' -> Running on a ' + cpuInfo.manufacturer + ' ' + cpuInfo.brand);
        const osInfo = await si.osInfo();
        if(osInfo.platform === "Linux" || osInfo.platform === "darwin") {
            log.info(' -> Supported Environment: ' + osInfo.distro + ' (' + osInfo.platform + ')');
        } else {
            log.info(' -> Unsupported Environment: ' + osInfo.distro + ' (' + osInfo.platform + ')');
        }

        return;
    } catch (e) {
        console.log(e)
    }
}

module.exports = serverIntegrityModule;