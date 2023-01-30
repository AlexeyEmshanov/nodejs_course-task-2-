import express from "express";

const app = express();

app.use(express.json()); //Body parser for requests

export default app;