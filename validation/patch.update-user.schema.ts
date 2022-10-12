import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";
import {UserWithOptionalFields} from "../types/user_type";

const bodySchemaForUpdatingUser = Joi.object({
  login: Joi.string(),
  password: Joi.string().alphanum(),
  age: Joi.number().min(4).max(130),
  isDeleted: Joi.boolean()
});

const paramsSchemaForUpdateUser = Joi.object({
  id: Joi.string().required()
})

interface UpdateUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserWithOptionalFields
}

export { bodySchemaForUpdatingUser, paramsSchemaForUpdateUser, UpdateUserSchema };
