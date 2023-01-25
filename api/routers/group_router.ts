import app from '../../app/app';
import {createGroup, getAllGroups, getGroupById} from '../../services';
import {validator} from "../../data-access/data-access";
import {ValidatedRequest} from "express-joi-validation";
import {GetGroupByIdSchema, paramsSchemaForGetGroupById} from "../../validation/groups_validation/get.group.schema";
import {
    bodySchemaForCreatingGroup,
    CreateGroupSchema
} from "../../validation/groups_validation/post.create-group.schema";

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


