import app from './app';
import '../api/routers/routes';
import { myErrorHandler } from "../api/middlewares/error_handlers";

const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});

app.use(myErrorHandler);
