import app from '../../app/app';
import services from "../../services";
import { validator } from "../../data-access/data-access";
import { paramsSchemaForGetGroupById } from "../../validation/groups_validation/get.group.schema";
import { bodySchemaForCreatingGroup } from "../../validation/groups_validation/post.create-group.schema";
import { bodySchemaForUpdateGroup, paramsSchemaForUpdateGroup } from "../../validation/groups_validation/put.update-group.schema";
import makeGroupController, { Groups_Controller_Type } from "../controllers/groups_controller";

const groupController: Groups_Controller_Type = makeGroupController(services);

app.get('/groups', groupController.getAllGroupsControllerMethod);

app.get('/groups/:id', validator.params(paramsSchemaForGetGroupById), groupController.getGroupByIdControllerMethod);

app.post('/groups', validator.body(bodySchemaForCreatingGroup), groupController.createGroupAtDBControllerMethod);

app.put('/groups/:id', validator.params(paramsSchemaForUpdateGroup), validator.body(bodySchemaForUpdateGroup), groupController.updateGroupControllerMethod);

app.delete('/groups/:id', validator.params(paramsSchemaForGetGroupById), groupController.deleteGroupControllerMethod);


