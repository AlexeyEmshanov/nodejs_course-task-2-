import * as Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

const paramsSchemaForGetGroupById = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required()
})

interface GetGroupByIdSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  }
}

export { paramsSchemaForGetGroupById, GetGroupByIdSchema };
