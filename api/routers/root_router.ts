import app from "../../app/app";
import {validator} from "../../data-access/data-access";
import {AuthUserSchema, bodySchemaForUserAuthorziation} from "../../validation/auth_validation/post.auth.schema";
import {ValidatedRequest} from "express-joi-validation";

//Middlewares for root routes
app.get('/', (req, res, next) => {
  try {
    res.send('Welcome to the test server!');
  } catch (err) {
    next(err);
  }
});

app.post('/auth', validator.body(bodySchemaForUserAuthorziation), (req: ValidatedRequest<AuthUserSchema>, res, next) => {
  if (req.body) {
    let login = req.body.login
    let password = req.body.password

    console.log('CREDENTIALS: ', login, password);

    res.json({message: `${login} - ${password}`})
  }
});

