import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { User, UserWithOptionalFields } from "../types/user_type";
import _ from 'lodash';
import * as Joi from 'joi';
import {ContainerTypes, ValidatedRequest, ValidatedRequestSchema, createValidator} from "express-joi-validation";

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});

//Storage in memory (variable) with default values
let storage: Array<User> = [];
const defaultUser: User = {
  id: uuidv4(),
  login: 'abc',
  password: 'password',
  age: 38,
  isDeleted: false
};
const defaultUser2: User = {
  id: '777',
  login: 'newUser2',
  password: 'newPassword2',
  age: 27,
  isDeleted: false
};
storage.push(defaultUser, defaultUser2);

//Validation
const validator = createValidator();

const bodySchemaForCreatingUser = Joi.object({
  id: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required(),
  isDeleted: Joi.boolean().required()
});

const bodySchemaForUpdatingUser = Joi.object({
  id: Joi.string(),
  login: Joi.string(),
  password: Joi.string().alphanum(),
  age: Joi.number().min(4).max(130),
  isDeleted: Joi.boolean()
});

const paramsSchemaForUpdateUser = Joi.object({
  id: Joi.string().required()
})

interface CreateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: User
}

interface UpdateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserWithOptionalFields
}

//Middlewares for handling requests
app.use(express.json()); //Body parser for requests

app.get('/', (req, res) => {
  res.send('Welcome to the test server!');
});

app.get('/users', (req, res) => {
  res.json(storage)
});

app.get('/users/:id', (req, res) => {
  let requestedUser = _.find(storage, {id: req.params.id})

  if (requestedUser) {
    res.json(requestedUser);
  } else {
    res.status(404)
      .json({message: `User with id ${req.params.id} not found`})
  }
});

app.post('/createUser', validator.body(bodySchemaForCreatingUser), (req: ValidatedRequest<CreateUserSchema>, res) => {
  const createdUser = req.body;

  if ( !_.isEmpty(req.body)) {
    storage.push(createdUser);
    res.status(200)
      .json({message: "User was successfully created!"})
  } else {
    res.status(400)
      .json({message: "User entity couldn't be empty!"})
  }
});

app.patch('/users/:id', validator.body(bodySchemaForUpdatingUser), validator.params(paramsSchemaForUpdateUser), (req: ValidatedRequest<UpdateUserSchema>, res) => {
  let requestedUserIndex = storage.findIndex(user => user.id === req.params.id);

  if (requestedUserIndex > 0) {
    storage[requestedUserIndex] = {
      ...storage[requestedUserIndex],
      ...req.body
    }

    res.json({message: `User with ID: ${req.params.id} was successfully updated!`})
  } else {
    res.status(400)
      .json({message: `User with ID: ${req.params.id} doesn't exist`})
  }
});

app.delete('/users/:id', (req, res) => {
  let requestedForDeleteUserIndex = storage.findIndex(user => user.id === req.params.id);

  if (requestedForDeleteUserIndex > 0) {
    storage[requestedForDeleteUserIndex] = {
      ...storage[requestedForDeleteUserIndex],
      isDeleted: true,
    }

    res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
  } else {
    res.status(400)
      .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
  }
})




