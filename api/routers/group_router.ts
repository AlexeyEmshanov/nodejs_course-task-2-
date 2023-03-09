import app from '../../app/app';
// import {
//   createGroup,
//   deleteGroup,
//   getAllGroups,
//   getGroupById,
//   updateGroup,
//   addUsersToGroup, findUsersAtGroup
// } from '../../services';
import services from "../../services";
import { validator } from "../../data-access/data-access";
import { ValidatedRequest} from "express-joi-validation";
import { GetGroupByIdSchema, paramsSchemaForGetGroupById } from "../../validation/groups_validation/get.group.schema";
import { bodySchemaForCreatingGroup, CreateGroupSchema } from "../../validation/groups_validation/post.create-group.schema";
import { bodySchemaForUpdateGroup, paramsSchemaForUpdateGroup, UpdateGroupSchema } from "../../validation/groups_validation/put.update-group.schema";
import {NextFunction} from "express";

app.get('/groups', async (req, res, next) => {
  try {
    //To simulate unhandled promise rejection
    new Promise((resolve, reject) => {
      setTimeout(() =>{ resolve('Promise resolve happens')}, 1000)
    }).then(() => {throw new Error('Promise Rejection Error happened')});
    // .catch(err => console.log('It is catch promise block', err));

    const groupsFromDB = await services.getAllGroups();

    if (groupsFromDB.length) {
      res.json(groupsFromDB);
    } else {
      res.status(404)
        .json({message: `No groups at database`})
    }
  }

  catch(err) {
    next(err);
  }
});

app.get('/groups/:id', validator.params(paramsSchemaForGetGroupById), async (req: ValidatedRequest<GetGroupByIdSchema>, res, next: NextFunction) => {
  try {
    const requestedUserFromDB = await services.getGroupById(req.params.id);
    if (requestedUserFromDB.length) {
      res.json(requestedUserFromDB);
    } else {
      res.status(404)
        .json({message: `User with id ${req.params.id} not found`})
    }
  }

  catch (err) {
    next(err);
  }
});

app.post('/groups', validator.body(bodySchemaForCreatingGroup), async (req: ValidatedRequest<CreateGroupSchema>, res, next) => {
  try {
    const createdGroup = await services.createGroup({ ...req.body });

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
});

app.put('/groups/:id', validator.params(paramsSchemaForUpdateGroup), validator.body(bodySchemaForUpdateGroup),  async (req: ValidatedRequest<UpdateGroupSchema>, res, next) => {
  try {
    const newGroupStateToUpdate = {...req.body};
    const groupToUpdateID = req.params.id;

    const successfullyUpdatesCounter = await services.updateGroup(newGroupStateToUpdate, groupToUpdateID);

    if (successfullyUpdatesCounter[0] > 0) {
      res.json({message: `Group with ID: ${groupToUpdateID} was successfully updated!`}).status(200);
    } else {
      res.status(400)
        .json({message: `Group with ID: ${groupToUpdateID} doesn't exist`})
    }
  }

  catch (err) {
    next(err);
  }
});

app.delete('/groups/:id', validator.params(paramsSchemaForGetGroupById), async (req: ValidatedRequest<GetGroupByIdSchema>, res, next) => {
  try {
    const successfullyDeletedCounter = await services.deleteGroup(req.params.id);

    if (successfullyDeletedCounter > 0) {
      res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
    } else {
      res.status(400)
        .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
    }
  }

  catch (err) {
    next(err);
  }
})

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
