import app from "../../app/app";
import {validator} from "../../data-access/data-access";
import {AuthUserSchema, bodySchemaForUserAuthorziation} from "../../validation/auth_validation/post.auth.schema";
import {ValidatedRequest} from "express-joi-validation";
import services from "../../services";
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
  const userWithCredentials = await services.getUserWithCredentials(req.body.login, req.body.password);

  if (userWithCredentials.length) {
    const payload = {"sub": userWithCredentials[0].get('id')};
    const accessToken = services.generateAccessToken(payload);
    const refreshToken = services.generateRefreshToken(payload);

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
        const accessToken = services.generateAccessToken(payload);
        const refreshToken = services.generateRefreshToken(payload);
        res.status(201).json({accessToken, refreshToken});
      }
    });
  } else {
    res.status(401).json({message: "Refresh token is not found!"})
  }
});


//For many-to-many testing purposes
//Create two records in UserGroups table for addUsersToGroup() method testing
app.get('/many', async (req, res, next) => {
  try {
    await services.addUsersToGroup('0db8327d-fa5f-482c-9023-e6476eb3402a', '77098ffa-cfc2-428a-a9eb-ce064b918b92');
    await services.addUsersToGroup('0db8327d-fa5f-482c-9023-e6476eb3402a', '7c655945-f3e6-4beb-80b9-188c896b3066');

    res.json({message: "Test records with addUsersToGroup() method created"});
  }

  catch (err) {
    next(err);
  }
});

app.get('/usersFromGroup', async (req, res) => {
  try {
    const usersAtGroup = await services.findUsersAtGroup('0db8327d-fa5f-482c-9023-e6476eb3402a');
    res.json({message: `There are following users at ${usersAtGroup[0].get('name')} group`, foundedUserAtGroup: usersAtGroup[0].get('Users')});
  }
  catch {
    res.status(400)
      .json({message: `Unfortunately there are no users belongs to requested group`});
  }
});

