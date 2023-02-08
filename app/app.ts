import express from "express";
import {exceptionHandler, methodsLogger, promiseRejectionHandler} from "../api/middlewares/error_handlers";

const app = express();

app.use(express.json()); //Body parser for requests

app.use(methodsLogger);
process.on('uncaughtException', exceptionHandler);
process.on('unhandledRejection', promiseRejectionHandler);

export default app;