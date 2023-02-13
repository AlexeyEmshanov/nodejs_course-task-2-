import {NextFunction, Request, Response} from "express";
import winston, { format }  from "winston";
import {round} from "lodash";

export function methodsLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = process.hrtime.bigint();
  console.log('\x1b[36m', '[Custom logger]','\x1b[0m', 'Method', req.method, 'on endpoint', req.path, 'was called with following arguments', req.params, 'and query params ', req.query);

  res.on('finish', () => {
    const finishTime = process.hrtime.bigint();
    const durationInMs = round(Number(finishTime - startTime) / 1000000, 5);
    winstonLogger.info(`Method ${req.method} on endpoint ${req.path} was called with following arguments ${JSON.stringify(req.params)} and query params ${JSON.stringify(req.query)} \nDuration: ${durationInMs} ms`);
  })

  next();
}

export function customErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.log('\x1b[33m', '[Custom error handler]', err.message, '\x1b[0m')
  res.status(501).send( "Something went wrong...")
  exceptionLogger.info(`[Custom error handler]. Method: ${req.method} on ${req.path}. Arguments: ${JSON.stringify(req.body)}, ${JSON.stringify(req.params)}, ${JSON.stringify(req.query)}. Error message: ${err.message}`)
  next();
}

//default process.on handling
export function exceptionHandler(err: Error): void {
//   console.log('\x1b[94m', '[Uncaught exception handler]', err, '\x1b[0m')
}

//default process.on handling
export function promiseRejectionHandler(err: Error): void {
//   console.log('\x1b[35m', '[Promise unhandled rejection handler]', err, '\x1b[0m');
}

//Winston usage
const myColors = {
  info: 'bold green',
  error: 'bold red'
}

const winstonLogger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    format.label({label : '[Winston logger]'}),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.align(),
    format.printf(info => `${info.label} ${[info.timestamp]} ${info.level}: ${info.message}`),
    format.colorize({all: true})
  )
});

export const exceptionLogger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console(),
  ],
  // exceptionHandlers: [new winston.transports.Console(), new winston.transports.File({filename: 'logs/exceptions.log'})],
  exceptionHandlers: [new winston.transports.Console()],
  exitOnError: false,
  format: winston.format.combine(
    format.label({label : '[Uncaught exception handler by Winston]'}),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.align(),
    format.printf(info => `${info.label} ${[info.timestamp]} ${info.level}: ${info.message}`),
    format.colorize({all: true})
  )
});

export const promiseRejectionLogger = winston.createLogger({
  level: 'info',
  // rejectionHandlers: [new winston.transports.Console(), new winston.transports.File({filename: 'logs/rejections.log'})],
  rejectionHandlers: [new winston.transports.Console()],
  exitOnError: false,
  format: winston.format.combine(
    format.label({label : '[Promise unhandled rejection handler by Winston]'}),
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.align(),
    format.printf(info => `${info.label} ${[info.timestamp]} ${info.level}: ${info.message}`),
    format.colorize({all: true})
  )
});

winston.addColors(myColors);


