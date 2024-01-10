import { AsyncLocalStorage } from 'async_hooks';
import fs from 'fs';
import path from 'path';
import { ErrorRequestHandler, RequestHandler } from 'express'
import { createLogger, format, transports } from 'winston';

import { HttpException } from '../exceptions/http.exceptions';

const asyncLocalStorage = new AsyncLocalStorage<{
  timestamp: string,
  remoteIp: string,
  method: string,
  path: string,
}>();

const logDir = 'logs';

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const httpLogger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.printf(({ message }) => JSON.stringify(message)),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  ]
});

function calculateResponseTime(startTimeDate: string) {
  const startTime = new Date(startTimeDate).getTime();
  const endTime = Date.now()
  return endTime - startTime
}

export const RequestLoggerMiddleware: RequestHandler = (req, res, next) => {
  const requestData = {
    timestamp: new Date().toISOString(),
    remoteIp: req.socket.remoteAddress!,
    method: req.method,
    path: req.originalUrl,
  };

  asyncLocalStorage.run(requestData, () => {
    res.on('finish', () => {
      if (res.statusCode < 400) {
        httpLogger.info({
          ...requestData,
          status: res.statusCode,
          responseTime: calculateResponseTime(requestData.timestamp)
        })
      }
    })

    next();
  });
};

function truncateErrorStack(stack = '', depth = 3) {
  const stackArray = stack.split('\n');
  const truncatedStack = stackArray.slice(0, depth).join('\n');
  return truncatedStack;
}

export const ErrorLoggerMiddleware: ErrorRequestHandler = (err: HttpException, req, res, next) => {
  const requestData = asyncLocalStorage.getStore();
  httpLogger.error({
    ...requestData,
    status: err.status,
    responseTime: calculateResponseTime(requestData!.timestamp),
    error: truncateErrorStack(err.stack)
  })
  next(err)
}