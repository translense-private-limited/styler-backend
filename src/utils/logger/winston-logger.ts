import { LoggerService } from '@nestjs/common';

import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';

export const createWinstonLoggerService = (): LoggerService => {
  const logsLocation = process.env.LOGS_PATH || './logs';
  const currentDate = new Date().toISOString().split('T')[0];

  return WinstonModule.createLogger({
    transports: [
      new transports.File({
        dirname: logsLocation,
        filename: `${currentDate}-error.log`,
        rotationFormat: () => '30d',
        zippedArchive: false,
        level: 'error',
        format: format.combine(format.timestamp(), format.json()),
      }),

      new transports.File({
        dirname: logsLocation,
        rotationFormat: () => '30d',
        filename: `${currentDate}-combined.log`,
        format: format.combine(format.timestamp(), format.json()),
        zippedArchive: false,
      }),
      new transports.Console({
        format: format.combine(
          format.cli(),
          format.splat(),
          format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          format.printf((info) => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
          }),
        ),
      }),
    ],
  });
};
