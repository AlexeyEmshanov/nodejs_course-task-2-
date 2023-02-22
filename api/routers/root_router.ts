import app from "../../app/app";
import {validator} from "../../data-access/data-access";
import {AuthUserSchema, bodySchemaForUserAuthorziation} from "../../validation/auth_validation/post.auth.schema";
import {ValidatedRequest} from "express-joi-validation";
import {getUserWithCredentials} from "../../services";
import jwt from 'jsonwebtoken';

//Middlewares for root routes
app.get('/', (req, res, next) => {
  try {
    res.send('Welcome to the test server!');
  } catch (err) {
    next(err);
  }
});

app.post('/auth', validator.body(bodySchemaForUserAuthorziation), async (req: ValidatedRequest<AuthUserSchema>, res, next) => {
  // TODO: how to make appropriate type to model
  const userWithCredentials = await getUserWithCredentials(req.body.login, req.body.password);

  if (userWithCredentials.length) {
    console.log('Requested user: ', userWithCredentials[0].get({plain: true}));
    const payload = {"sub": userWithCredentials[0].get('id')};
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY_FOR_JWT as string, {expiresIn: 100});

    res
      .status(201)
      .json({token})
  } else {
    res.status(401).send('Incorrect login / password pair. Access denied!!!')
  }
});

