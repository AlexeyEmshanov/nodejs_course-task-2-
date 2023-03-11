import {User, validator} from "../../data-access/data-access";
import { querySchemaForSuggestedUser, SuggestedUserSchema } from "../../validation/users_validation/get.suggested-user.schema";
import { ValidatedRequest } from "express-joi-validation";
import { bodySchemaForCreatingUser, CreateUserSchema } from "../../validation/users_validation/post.create-user.schema";
import { bodySchemaForUpdateUser, paramsSchemaForUpdateUser, UpdateUserSchema } from "../../validation/users_validation/put.update-user.schema";
import app from "../../app/app";
import services, {App_Services_Type} from "../../services";
import { GetUserByIdSchema, paramsSchemaForGetUserById } from "../../validation/users_validation/get.user.schema";
import { NextFunction } from "express";
import {IUser} from "../../types/user_type";
import {Model} from "sequelize";
import makeUserController, {Users_Controller_Type} from "../controllers/users_controller";

const userController: Users_Controller_Type = makeUserController(services);

app.get('/users', userController.getAllUsersControllerMethod);

app.get('/users/:id', validator.params(paramsSchemaForGetUserById), userController.getUserByIDControllerMethod);

app.post('/users', validator.body(bodySchemaForCreatingUser), userController.createUserControllerMethod);




app.put('/users/:id', validator.params(paramsSchemaForUpdateUser), validator.body(bodySchemaForUpdateUser),  async (req: ValidatedRequest<UpdateUserSchema>, res, next) => {
  try {
    const newUserStateToUpdate = {...req.body};
    const userToUpdateID = req.params.id;
    const successfullyUpdatesCounter = await services.updateUser(newUserStateToUpdate, userToUpdateID);

    if (successfullyUpdatesCounter[0] > 0) {
      res.json({message: `User with ID: ${userToUpdateID} was successfully updated!`}).status(200);
    } else {
      res.status(400)
        .json({message: `User with ID: ${userToUpdateID} doesn't exist`})
    }
  }

  catch (err) {
    next(err);
  }
});

app.delete('/users/:id', validator.params(paramsSchemaForGetUserById), async (req: ValidatedRequest<GetUserByIdSchema>, res, next) => {
  try {
    const successfullyDeletedCounter = await services.deleteUser(req.params.id);

    if (successfullyDeletedCounter[0] > 0) {
      res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
    } else {
      res.status(400)
        .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
    }
  }

  catch (err) {
    next(err);
  }
});

app.get('/search', validator.query(querySchemaForSuggestedUser), async (req: ValidatedRequest<SuggestedUserSchema>, res, next: NextFunction) => {
  try {
    const searchSubstring = req.query.loginSubstring;
    const numberOfSearchEntity = req.query.limit;
    const result = await services.getAutoSuggestUsers(searchSubstring, numberOfSearchEntity);

    if (result.length > 0) {
      res.send(result)
    } else {
      res.status(400)
        .json({ message: `Users with substring \u201c${searchSubstring}\u201c at login doesn't exist at data base.`})
    }
  }

  catch (err: any) {
    err.testData = {

    };
    next(err);
  }
});


