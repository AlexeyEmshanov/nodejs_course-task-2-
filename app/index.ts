import express from "express";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello my friend!!!');
})

app.listen(port, () => {
    console.log(`The application is running on ${port}`);
})