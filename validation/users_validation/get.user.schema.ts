import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";

const paramsSchemaForGetUserById = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required()
})

interface GetUserByIdSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
}

export { paramsSchemaForGetUserById, GetUserByIdSchema };
