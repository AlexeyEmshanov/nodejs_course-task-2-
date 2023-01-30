import app from "../../app/app";

//Middlewares for root routes
app.get('/', (req, res) => {
  res.send('Welcome to the test server!');
});

