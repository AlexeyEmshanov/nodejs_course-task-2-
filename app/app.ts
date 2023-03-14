import express from "express";
import cors from "cors";
import {
  exceptionHandler,
  methodsLogger,
  promiseRejectionHandler
} from "../api/middlewares/error_handlers";
import {authenticationMiddleware} from "../api/middlewares/authentication";

const corsOption = {
    // origin: ["https://www.example.com"]
};

const app = express();

app.use(express.json()); //Body parser for requests
app.use(cors(corsOption));
app.use(methodsLogger);
//TODO: uncomment after finishing with tests
// app.use(authenticationMiddleware);

//default process.on handling
process.on('unhandledRejection', promiseRejectionHandler);
process.on('uncaughtException', exceptionHandler);

export default app;