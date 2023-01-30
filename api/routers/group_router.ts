import app from '../../app/app';
import {
    createGroup,
    deleteGroup,
    getAllGroups,
    getGroupById,
    updateGroup,
    addUsersToGroup, findUsersAtGroup
} from '../../services';
import { validator } from "../../data-access/data-access";
import { ValidatedRequest} from "express-joi-validation";
import { GetGroupByIdSchema, paramsSchemaForGetGroupById } from "../../validation/groups_validation/get.group.schema";
import { bodySchemaForCreatingGroup, CreateGroupSchema } from "../../validation/groups_validation/post.create-group.schema";
import { bodySchemaForUpdateGroup, paramsSchemaForUpdateGroup, UpdateGroupSchema } from "../../validation/groups_validation/put.update-group.schema";

app.get('/groups', async (req, res) => {
    const groupsFromDB = await getAllGroups();

    if (groupsFromDB.length) {
        res.json(groupsFromDB);
    } else {
        res.status(404)
          .json({message: `No groups at database`})
    }
});

app.get('/groups/:id', validator.params(paramsSchemaForGetGroupById), async (req: ValidatedRequest<GetGroupByIdSchema>, res) => {
    const requestedUserFromDB = await getGroupById(req.params.id);
    if (requestedUserFromDB.length) {
        res.json(requestedUserFromDB);
    } else {
        res.status(404)
          .json({message: `User with id ${req.params.id} not found`})
    }
});

app.post('/groups', validator.body(bodySchemaForCreatingGroup), async (req: ValidatedRequest<CreateGroupSchema>, res) => {
    const createdGroup = await createGroup({ ...req.body });

    if (createdGroup) {
        res.status(201)
          .json({message: `Group was successfully created with ID ${createdGroup.get('id')}!`})
    } else {
        res.status(400)
          .json({message: "In the process of Group creation something went wrong..."})
    }
});

app.put('/groups/:id', validator.params(paramsSchemaForUpdateGroup), validator.body(bodySchemaForUpdateGroup),  async (req: ValidatedRequest<UpdateGroupSchema>, res) => {
    const newGroupStateToUpdate = {...req.body};
    const groupToUpdateID = req.params.id;

    const successfullyUpdatesCounter = await updateGroup(newGroupStateToUpdate, groupToUpdateID);

    if (successfullyUpdatesCounter[0] > 0) {
        res.json({message: `Group with ID: ${groupToUpdateID} was successfully updated!`}).status(200);
    } else {
        res.status(400)
          .json({message: `Group with ID: ${groupToUpdateID} doesn't exist`})
    }
});

app.delete('/groups/:id', validator.params(paramsSchemaForGetGroupById), async (req: ValidatedRequest<GetGroupByIdSchema>, res) => {
    const successfullyDeletedCounter = await deleteGroup(req.params.id);

    if (successfullyDeletedCounter > 0) {
        res.json({message: `User with ID: ${req.params.id} was successfully deleted!`})
    } else {
        res.status(400)
          .json({message: `User with ID: ${req.params.id} doesn't exist. Deleting is impossible!`})
    }
})

//Create two records in UserGroups table for addUsersToGroup() method testing
app.get('/many', async (req, res) => {
    await addUsersToGroup('0db8327d-fa5f-482c-9023-e6476eb3402a', '77098ffa-cfc2-428a-a9eb-ce064b918b92');
    await addUsersToGroup('0db8327d-fa5f-482c-9023-e6476eb3402a', '7c655945-f3e6-4beb-80b9-188c896b3066');

    res.json({message: "Test records with addUsersToGroup() method created"});
});

app.get('/usersFromGroup', async (req, res) => {
    try {
        const usersAtGroup = await findUsersAtGroup('0db8327d-fa5f-482c-9023-e6476eb3402a');
        res.json({message: `There are following users at ${usersAtGroup[0].get('name')} group`, foundedUserAtGroup: usersAtGroup[0].get('Users')});
    }
    catch {
        res.status(400)
          .json({message: `Unfortunately there are no users belongs to requested group`});
    }
});
