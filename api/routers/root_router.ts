import app from "../../app/app";
import {validator} from "../../data-access/data-access";
import {AuthUserSchema, bodySchemaForUserAuthorziation} from "../../validation/auth_validation/post.auth.schema";
import {ValidatedRequest} from "express-joi-validation";
import {getUserWithCredentials} from "../../services";

//Middlewares for root routes
app.get('/', (req, res, next) => {
  try {
    res.send('Welcome to the test server!');
  } catch (err) {
    next(err);
  }
});

app.post('/auth', validator.body(bodySchemaForUserAuthorziation), async (req: ValidatedRequest<AuthUserSchema>, res, next) => {
  const userWithCredentials = await getUserWithCredentials(req.body.login, req.body.password);

  if (userWithCredentials.length) {
    console.log('Requested user: ', userWithCredentials[0].get({plain: true}));

    res.json({Logged_in_user: userWithCredentials[0].get({plain: true})})
  } else {
    res.status(401).send('Incorrect login / password pair. Access denied!!!')
  }
});

