import log from 'loglevel';

const Logger = log.getLogger('app');

if (process.env.REACT_APP_MODE !== 'PROD') {
    Logger.setLevel('debug');
} else {
    Logger.setLevel('warn');
}

export default Logger;