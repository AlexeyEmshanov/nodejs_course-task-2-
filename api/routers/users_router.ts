import { validator } from "../../data-access/data-access";
import { querySchemaForSuggestedUser } from "../../validation/users_validation/get.suggested-user.schema";
import { bodySchemaForCreatingUser } from "../../validation/users_validation/post.create-user.schema";
import { bodySchemaForUpdateUser, paramsSchemaForUpdateUser } from "../../validation/users_validation/put.update-user.schema";
import app from "../../app/app";
import services from "../../services";
import { paramsSchemaForGetUserById } from "../../validation/users_validation/get.user.schema";
import makeUserController, { Users_Controller_Type } from "../controllers/users_controller";

const userController: Users_Controller_Type = makeUserController(services);

app.get('/users', userController.getAllUsersControllerMethod);

app.get('/users/:id', validator.params(paramsSchemaForGetUserById), userController.getUserByIDControllerMethod);

app.post('/users', validator.body(bodySchemaForCreatingUser), userController.createUserControllerMethod);

app.put('/users/:id', validator.params(paramsSchemaForUpdateUser), validator.body(bodySchemaForUpdateUser),  userController.updateUserControllerMethod);

app.delete('/users/:id', validator.params(paramsSchemaForGetUserById), userController.deleteUserControllerMethod);

app.get('/search', validator.query(querySchemaForSuggestedUser), userController.searchUserControllerMethod);


