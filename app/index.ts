import app from './app';
import '../api/routers/root_router';
import '../api/routers/users_router';
import '../api/routers/group_router';

const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});
