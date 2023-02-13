import app from './app';
import '../api/routers/routes';
import {customErrorHandler} from "../api/middlewares/error_handlers";

const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});

app.use(customErrorHandler);
