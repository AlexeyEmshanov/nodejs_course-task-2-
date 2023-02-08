import {NextFunction, Request, Response} from "express";

export function methodsLogger( req: Request, res: Response, next: NextFunction): void {
  console.log('\x1b[36m', '[Custom logger]','\x1b[0m', 'Method', req.method, 'on endpoint', req.path, 'was called with following arguments', req.body, 'and query params ', req.query);
  next();
}

export function myErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.log('\x1b[33m', '[Custom error handler]', err, '\x1b[0m')
  res.status(501).send( "Something went wrong...")
  next();
}

export function exceptionHandler(err: Error): void {
  console.log('\x1b[94m', '[Uncaught exception handler]', err, '\x1b[0m')
}

export function promiseRejectionHandler(err: Error): void {
  console.log('\x1b[35m', '[Promise unhandled rejection handler]', err, '\x1b[0m');
}

