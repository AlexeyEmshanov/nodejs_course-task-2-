import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";

const bodySchemaForUserAuthorziation = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().alphanum().required(),
});

interface AuthUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]:  {
    login: string,
    password: string
  }
}

export { bodySchemaForUserAuthorziation, AuthUserSchema };