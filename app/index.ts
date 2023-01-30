import app from './app';
import '../api/routers/routes';

const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});
