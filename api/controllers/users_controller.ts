import {NextFunction, Request, Response} from "express";

import {ValidatedRequest} from "express-joi-validation";
import {GetUserByIdSchema} from "../../validation/users_validation/get.user.schema";
import services, {App_Services_Type} from "../../services";

async function getUsers(reqParams: { }, res: Response, next: NextFunction): Promise<void> {
  try {
    //To simulate uncaught exception
    // setTimeout(() => { throw new Error('Uncaught async exception happened') }, 1000);

    //To simulate unexpected exception in middleware
    // throw new Error('Unexpected exception in middleware happened');

    const usersFromDB = await services.getAllUsersFromDB();

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
}

// export async function getUserById(id: string) {
//   const requestedUserFromDB = await getUserByIdFromDB(id);
//   if (requestedUserFromDB.length) {
//     return requestedUserFromDB;
//   } else {
//     return [];
//   }
// };

export type Users_Controller_Type = {
  getUserByIDController: typeof getUserByIDController,
  getUsers: typeof getUsers,
  services: App_Services_Type
}

export default function (services: App_Services_Type): Users_Controller_Type {
  return {
    getUserByIDController,
    getUsers,
    services
  }
}

async function getUserByIDController(req: ValidatedRequest<GetUserByIdSchema>, res: Response, next: NextFunction) {
  try {
    const requestedUserFromDB = await services.getUserByIdFromDB(req.params.id);
    console.log('!!!-1')
    if (requestedUserFromDB.length) {
      console.log('!!!-2')
      res.json(requestedUserFromDB);
    } else {
      console.log('!!!-3')
      res.status(404)
        .json({message: `User with id ${req.params.id} not found`})
    }
  }
  catch (err) {
    next(err)
  }
}

