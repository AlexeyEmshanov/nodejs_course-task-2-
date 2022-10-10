import express from "express";
import { v4 as uuidv4 } from 'uuid';
import User from "../types/user_type";
import _ from 'lodash';

const app = express();
const port = 3000;

const storage: User[] = [];

const defaultUser: User = {
  id: uuidv4(),
  login: 'abc',
  password: 'password',
  age: 38,
  isDeleted: false
};

storage.push(defaultUser);

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

app.post('/createUser', (req, res) => {
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

app.listen(port, () => {
  console.log(`The application is running on ${port}`);
});