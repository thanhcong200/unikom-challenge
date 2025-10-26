import winston from 'winston';
import { omit } from 'lodash';
import { LOG_OUTPUT_JSON, LOG_LEVEL } from 'src/config/environtment';

const { combine, timestamp, colorize, align, printf, json } = winston.format;

let format: winston.Logform.Format;

if (LOG_OUTPUT_JSON) {
    format = combine(
        timestamp(),
        winston.format((info) => {
            if (!info.stringData) {
                info.stringData = JSON.stringify(omit(info, ['timestamp', 'level', 'message']));
            }
            return info;
        })(),
        json(),
    );
} else {
    format = combine(
        timestamp(),
        colorize(),
        align(),
        printf((info) => {
            return `${info.timestamp} ${info.level} ${info.message} ${JSON.stringify(
                omit(info, ['timestamp', 'level', 'message']),
            )}`;
        }),
    );
}

const logger = winston.createLogger({
    level: LOG_LEVEL,
    format,
    transports: [new winston.transports.Console()],
});

export default logger;
