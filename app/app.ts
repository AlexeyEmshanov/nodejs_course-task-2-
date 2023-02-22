import express from "express";
import * as dotenv from "dotenv";
import {
  exceptionHandler,
  methodsLogger,
  promiseRejectionHandler
} from "../api/middlewares/error_handlers";
import {authenticationWithJWTMiddleware} from "../api/middlewares/authentication";

dotenv.config();
const app = express();

app.use(express.json()); //Body parser for requests
app.use(methodsLogger);
app.use(authenticationWithJWTMiddleware);

//default process.on handling
process.on('unhandledRejection', promiseRejectionHandler);
process.on('uncaughtException', exceptionHandler);

export default app;