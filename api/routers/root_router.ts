import app from "../../app/app";
import {validator} from "../../data-access/data-access";
import {AuthUserSchema, bodySchemaForUserAuthorziation} from "../../validation/auth_validation/post.auth.schema";
import {ValidatedRequest} from "express-joi-validation";
import {generateAccessToken, generateRefreshToken, getUserWithCredentials} from "../../services";
import jwt from 'jsonwebtoken';

//Middlewares for root routes
app.get('/', (req, res, next) => {
  try {
    res.send('Welcome to the test server!');
  } catch (err) {
    next(err);
  }
});

app.post('/login', validator.body(bodySchemaForUserAuthorziation), async (req: ValidatedRequest<AuthUserSchema>, res) => {
  // TODO: how to make appropriate type to model
  const userWithCredentials = await getUserWithCredentials(req.body.login, req.body.password);

  if (userWithCredentials.length) {
    const payload = {"sub": userWithCredentials[0].get('id')};
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({accessToken, refreshToken});
  } else {
    res.status(401).send('Incorrect login / password pair. Access denied!!!');
  }
});

app.post('/refresh', async (req, res) => {
  const refreshToken = req.headers['x-auth-token'];

  if (refreshToken) {
    jwt.verify(refreshToken as string, process.env.REFRESH_TOKEN_SECRET_KEY_FOR_JWT as string, function(error, decoded) {
      if (error) {
        res.status(403).json({message: "Provided refresh token is invalid!"})
      } else {
        const payload = {"sub": decoded?.sub};
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        res.status(201).json({accessToken, refreshToken});
      }
    });
  } else {
    res.status(401).json({message: "Refresh token is not found!"})
  }
});

