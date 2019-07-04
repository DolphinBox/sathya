const moment = require('moment');
const chalk = require('chalk');

class Helpers {
    constructor(logName){
        this.logName = logName;

        this.log = {
            info: (content) => {
                let now = moment().format();
                console.log('[' + now + ' ' + this.logName + ' ' + chalk.green('INFO') + ' ] '+ content)
            },
            error: (content) => {
                let now = moment().format();
                console.error('[' + now + ' ' + this.logName + ' ' + chalk.red('ERROR') + '] '+ content)
            },
            warn: (content) => {
                let now = moment().format();
                console.warn('[' + now + ' ' + this.logName + ' ' + chalk.yellow('WARN') + ' ] '+ content)
            }
        };
    }
}

module.exports = Helpers