import { NextFunction, Request, Response } from "express";
import { ValidatedRequest} from "express-joi-validation";
import services, { App_Services_Type } from "../../services";
import { GetGroupByIdSchema } from "../../validation/groups_validation/get.group.schema";
import { CreateGroupSchema } from "../../validation/groups_validation/post.create-group.schema";
import { UpdateGroupSchema } from "../../validation/groups_validation/put.update-group.schema";

export type Groups_Controller_Type = {
  getAllGroupsControllerMethod: typeof getAllGroupsControllerMethod,
  getGroupByIdControllerMethod: typeof getGroupByIdControllerMethod,
  createGroupAtDBControllerMethod: typeof createGroupAtDBControllerMethod,
  updateGroupControllerMethod: typeof updateGroupControllerMethod,
  deleteGroupControllerMethod: typeof deleteGroupControllerMethod,
  services: App_Services_Type
}

export default function (services: App_Services_Type): Groups_Controller_Type {
  return {
    getAllGroupsControllerMethod,
    getGroupByIdControllerMethod,
    createGroupAtDBControllerMethod,
    updateGroupControllerMethod,
    deleteGroupControllerMethod,
    services
  }
}

async function getAllGroupsControllerMethod (req: Request, res: Response, next: NextFunction) {
  try {
    //To simulate unhandled promise rejection
    // new Promise((resolve, reject) => {
    //   setTimeout(() =>{ resolve('Promise resolve happens')}, 1000)
    // }).then(() => {throw new Error('Promise Rejection Error happened')});
    // .catch(err => console.log('It is catch promise block', err));

    const groupsFromDB = await services.getAllGroupsFromDB();

    if (groupsFromDB.length) {
      res.status(200)
        .json(groupsFromDB);
    } else {
      res.status(404)
        .json({message: `No groups at database`})
    }
  }

  catch(err) {
    next(err);
  }
}

async function getGroupByIdControllerMethod (req: ValidatedRequest<GetGroupByIdSchema>, res: Response, next: NextFunction) {
  try {
    const requestedUserFromDB = await services.getGroupByIdFromDB(req.params.id);
    if (requestedUserFromDB.length) {
      res.status(200)
        .json(requestedUserFromDB);
    } else {
      res.status(404)
        .json({message: `User with id ${req.params.id} not found`})
    }
  }

  catch (err) {
    next(err);
  }
}

async function createGroupAtDBControllerMethod(req: ValidatedRequest<CreateGroupSchema>, res: Response, next: NextFunction) {
  try {
    const createdGroup = await services.createGroupAtDB({ ...req.body });

    if (createdGroup) {
      res.status(201)
        .json({message: `Group was successfully created with ID ${createdGroup.get('id')}!`})
    } else {
      res.status(400)
        .json({message: "In the process of Group creation something went wrong..."})
    }
  }

  catch (err) {
    next(err);
  }
};

async function updateGroupControllerMethod (req: ValidatedRequest<UpdateGroupSchema>, res: Response, next: NextFunction) {
  try {
    const newGroupStateToUpdate = {...req.body};
    const groupToUpdateID = req.params.id;

    const successfullyUpdatesCounter = await services.updateGroupAtDB(newGroupStateToUpdate, groupToUpdateID);

    if (successfullyUpdatesCounter[0] > 0) {
      res.status(200)
        .json({message: `Group with ID: ${groupToUpdateID} was successfully updated!`});
    } else {
      res.status(400)
        .json({message: `Group with ID: ${groupToUpdateID} doesn't exist`})
    }
  }

  catch (err) {
    next(err);
  }
}

async function deleteGroupControllerMethod(req: ValidatedRequest<GetGroupByIdSchema>, res: Response, next: NextFunction) {
  try {
    const successfullyDeletedCounter = await services.deleteGroupAtDB(req.params.id);

    if (successfullyDeletedCounter > 0) {
      res.status(200)
        .json({message: `Group with ID: ${req.params.id} was successfully deleted!`})
    } else {
      res.status(400)
        .json({message: `Group with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
    }
  }

  catch (err) {
    next(err);
  }
}

