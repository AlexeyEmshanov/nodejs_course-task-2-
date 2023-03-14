import { NextFunction, Response } from "express";
import { ValidatedRequest } from "express-joi-validation";
import { GetUserByIdSchema } from "../../validation/users_validation/get.user.schema";
import services, { App_Services_Type } from "../../services";
import { CreateUserSchema } from "../../validation/users_validation/post.create-user.schema";
import { UpdateUserSchema } from "../../validation/users_validation/put.update-user.schema";
import { SuggestedUserSchema } from "../../validation/users_validation/get.suggested-user.schema";

export type Users_Controller_Type = {
  getUserByIDControllerMethod: typeof getUserByIDControllerMethod,
  getAllUsersControllerMethod: typeof getAllUsersControllerMethod,
  createUserControllerMethod: typeof createUserControllerMethod,
  updateUserControllerMethod: typeof updateUserControllerMethod,
  deleteUserControllerMethod: typeof deleteUserControllerMethod,
  searchUserControllerMethod: typeof searchUserControllerMethod,
  services: App_Services_Type
}

export default function (services: App_Services_Type): Users_Controller_Type {
  return {
    getUserByIDControllerMethod,
    getAllUsersControllerMethod,
    createUserControllerMethod,
    updateUserControllerMethod,
    deleteUserControllerMethod,
    searchUserControllerMethod,
    services
  }
}

async function getAllUsersControllerMethod(reqParams: { }, res: Response, next: NextFunction): Promise<void> {
  try {
    //To simulate uncaught exception
    // setTimeout(() => { throw new Error('Uncaught async exception happened') }, 1000);

    //To simulate unexpected exception in middleware
    // throw new Error('Unexpected exception in middleware happened');

    const usersFromDB = await services.getAllUsersFromDB();

    if (usersFromDB.length) {
      res.status(200)
        .json(usersFromDB);
    } else {
      res.status(404)
        .json({message: `No users at database`})
    }
  }

  catch (err) {
    next(err);
  }
}

async function getUserByIDControllerMethod(req: ValidatedRequest<GetUserByIdSchema>, res: Response, next: NextFunction) {
  try {
    const requestedUserFromDB = await services.getUserByIdFromDB(req.params.id);
    if (requestedUserFromDB.length) {
      res.status(200)
        .json(requestedUserFromDB);
    } else {
      res.status(404)
        .json({message: `User with id ${req.params.id} not found`});
    }
  }
  catch (err) {
    next(err)
  }
}

async function createUserControllerMethod (req: ValidatedRequest<CreateUserSchema>, res: Response, next: NextFunction) {
  try {
    const createdUser = await services.createUserAtDB({ ...req.body });

    if (createdUser) {
      res.status(201)
        .json({message: `User was successfully created with ID ${createdUser.get('id')}!`});
    } else {
      res.status(400)
        .json({message: "In the process of User creation something went wrong..."})
    }
  }

  catch (err) {
    next(err)
  }
}

async function updateUserControllerMethod (req: ValidatedRequest<UpdateUserSchema>, res: Response, next: NextFunction) {
  try {
    const newUserStateToUpdate = {...req.body};
    const userToUpdateID = req.params.id;
    const successfullyUpdatesCounter = await services.updateUserAtDB(newUserStateToUpdate, userToUpdateID);

    if (successfullyUpdatesCounter[0] > 0) {
      res.status(200).json({message: `User with ID: ${userToUpdateID} was successfully updated!`});
    } else {
      res.status(400)
        .json({message: `User with ID: ${userToUpdateID} doesn't exist`})
    }
  }

  catch (err) {
    next(err);
  }
}

async function deleteUserControllerMethod (req: ValidatedRequest<GetUserByIdSchema>, res: Response, next: NextFunction) {
  try {
    const successfullyDeletedCounter = await services.deleteUserAtDB(req.params.id);

    if (successfullyDeletedCounter[0] > 0) {
      res.status(200).json({message: `User with ID: ${req.params.id} was successfully deleted!`})
    } else {
      res.status(400)
        .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
    }
  }

  catch (err) {
    next(err);
  }
}

async function searchUserControllerMethod(req: ValidatedRequest<SuggestedUserSchema>, res: Response, next: NextFunction) {
  try {
    const searchSubstring = req.query.loginSubstring;
    const numberOfSearchEntity = req.query.limit;
    const result = await services.getAutoSuggestUsersFromDB(searchSubstring, numberOfSearchEntity);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(400)
        .json({ message: `Users with substring \u201c${searchSubstring}\u201c at login doesn't exist at data base.`});
    }
  }

  catch (err: any) {
    next(err);
  }
}

