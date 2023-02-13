import app from "../../app/app";

//Middlewares for root routes
app.get('/', (req, res, next) => {
  try {
    res.send('Welcome to the test server!');
  } catch (err) {
    next(err);
  }
});

