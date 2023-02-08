import { validator} from "../../data-access/data-access";
import { querySchemaForSuggestedUser, SuggestedUserSchema } from "../../validation/users_validation/get.suggested-user.schema";
import { ValidatedRequest } from "express-joi-validation";
import { bodySchemaForCreatingUser, CreateUserSchema } from "../../validation/users_validation/post.create-user.schema";
import { bodySchemaForUpdateUser, paramsSchemaForUpdateUser, UpdateUserSchema } from "../../validation/users_validation/put.update-user.schema";
import app from "../../app/app";
import { createUser, deleteUser, getAllUsers, getAutoSuggestUsers, getUserById, updateUser } from "../../services";
import { GetUserByIdSchema, paramsSchemaForGetUserById } from "../../validation/users_validation/get.user.schema";
import {NextFunction} from "express";


app.get('/users', async (req, res, next: NextFunction) => {
  try {
    //To simulate uncaught exception
    setTimeout(() => { throw new Error('Uncaught exception happened') }, 1000);

    //To simulate unexpected exception in middleware
    throw new Error('Unexpected exception in middleware happened');

    const usersFromDB = await getAllUsers();

    if (usersFromDB.length) {
      res.json(usersFromDB);
    } else {
      res.status(404)
        .json({message: `No users at database`})
    }
  }

  catch (err) {
    next(err);
  }
});

app.get('/users/:id', validator.params(paramsSchemaForGetUserById), async (req: ValidatedRequest<GetUserByIdSchema>, res) => {
  const requestedUserFromDB = await getUserById(req.params.id);
  if (requestedUserFromDB.length) {
    res.json(requestedUserFromDB);
  } else {
    res.status(404)
      .json({message: `User with id ${req.params.id} not found`})
  }
});

app.get('/search', validator.query(querySchemaForSuggestedUser), async (req: ValidatedRequest<SuggestedUserSchema>, res) => {
  const searchSubstring = req.query.loginSubstring;
  const numberOfSearchEntity = req.query.limit;
  const result = await getAutoSuggestUsers(searchSubstring, numberOfSearchEntity);

  if (result.length > 0) {
    res.send(result)
  } else {
    res.status(400)
      .json({ message: `Users with substring \u201c${searchSubstring}\u201c at login doesn't exist at data base.`})
  }
})

app.post('/users', validator.body(bodySchemaForCreatingUser), async (req: ValidatedRequest<CreateUserSchema>, res) => {
  const createdUser = await createUser({ ...req.body });

  if (createdUser) {
    res.status(201)
      .json({message: `User was successfully created with ID ${createdUser.get('id')}!`})
  } else {
    res.status(400)
      .json({message: "In the process of User creation something went wrong..."})
  }
});

app.put('/users/:id', validator.params(paramsSchemaForUpdateUser), validator.body(bodySchemaForUpdateUser),  async (req: ValidatedRequest<UpdateUserSchema>, res) => {
  const newUserStateToUpdate = {...req.body};
  const userToUpdateID = req.params.id;
  const successfullyUpdatesCounter = await updateUser(newUserStateToUpdate, userToUpdateID);

  if (successfullyUpdatesCounter[0] > 0) {
    res.json({message: `User with ID: ${userToUpdateID} was successfully updated!`}).status(200);
  } else {
    res.status(400)
      .json({message: `User with ID: ${userToUpdateID} doesn't exist`})
  }
});

app.delete('/users/:id', validator.params(paramsSchemaForGetUserById), async (req: ValidatedRequest<GetUserByIdSchema>, res) => {
  const successfullyDeletedCounter = await deleteUser(req.params.id);

  if (successfullyDeletedCounter[0] > 0) {
    res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
  } else {
    res.status(400)
      .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
  }
})

