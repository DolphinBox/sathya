function init() {
    // uncaughtException is thrown whenever the node thread reaches an error.
    process.on('uncaughtException', function (err) {
        console.error('----------------------------------------------------------------------');
        console.error('~ CRASH - Sathya has run into an unrecoverable error and had to stop ~');
        console.error('  -> [' + (new Date).toUTCString() + ']', err.message);
        console.error(err.stack);
        console.error('----------------------------------------------------------------------');
        process.exit(1);
    });
    // Handle crashes related to promises and async/await
    process.on('unhandledRejection', (err, p) => {
        console.error('----------------------------------------------------------------------');
        console.error('~ CRASH - Sathya has run into an unrecoverable error and had to stop ~');
        console.error('  -> [' + (new Date).toUTCString() + '] Promise: ' + p);
        console.error(err.stack);
        console.error('----------------------------------------------------------------------');
        process.exit(1);
    });
}



module.exports = init;