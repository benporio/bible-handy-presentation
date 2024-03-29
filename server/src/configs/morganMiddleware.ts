import morgan, { StreamOptions } from 'morgan';
import Logger from '../utils/Logger'

const stream: StreamOptions = {
    write: (message) => Logger.http(message),
};

const skip = () => {
    return process.env.MODE === 'PROD';
};

const morganMiddleware = morgan(
    ':remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms',
    { stream, skip }
);
    
export default morganMiddleware;