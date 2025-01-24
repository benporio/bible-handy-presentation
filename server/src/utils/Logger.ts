import winston from 'winston'
import dotenv from 'dotenv';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

dotenv.config();

const level = () => {
    return process.env.MODE !== 'PROD' ? 'debug' : 'info'
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
)
        
const transports = [
    new winston.transports.Console({
        format: winston.format.colorize({ all: true }),
    }),
    new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
]

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
}) 

export default Logger