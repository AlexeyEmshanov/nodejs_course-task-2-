import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";
import { IUser } from "../types/user_type";

const bodySchemaForCreatingUser = Joi.object({
  // id: Joi.string().required(),
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
  age: Joi.number().min(4).max(130).required(),
  // isDeleted: Joi.boolean().required()
});

interface CreateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IUser
}

export { bodySchemaForCreatingUser, CreateUserSchema };