import {NextFunction, Request, Response} from "express";

import {ValidatedRequest} from "express-joi-validation";
import {GetUserByIdSchema} from "../../validation/users_validation/get.user.schema";
import services, {App_Services_Type} from "../../services";
import {CreateUserSchema} from "../../validation/users_validation/post.create-user.schema";



// export async function getUserById(id: string) {
//   const requestedUserFromDB = await getUserByIdFromDB(id);
//   if (requestedUserFromDB.length) {
//     return requestedUserFromDB;
//   } else {
//     return [];
//   }
// };

export type Users_Controller_Type = {
  getUserByIDControllerMethod: typeof getUserByIDControllerMethod,
  getAllUsersControllerMethod: typeof getAllUsersControllerMethod,
  createUserControllerMethod: typeof createUserControllerMethod,
  services: App_Services_Type
}

export default function (services: App_Services_Type): Users_Controller_Type {
  return {
    getUserByIDControllerMethod,
    getAllUsersControllerMethod,
    createUserControllerMethod,
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

