import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";
import {IGroup} from "../../types/group_type";

const bodySchemaForUpdateGroup = Joi.object({
  name: Joi.string(),
  permission: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'))
});

const paramsSchemaForUpdateGroup = Joi.object({
  id: Joi.string().guid({version: 'uuidv4'}).required()
})

interface UpdateGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IGroup,
  [ContainerTypes.Params]: { id: string }
}

export { bodySchemaForUpdateGroup, paramsSchemaForUpdateGroup, UpdateGroupSchema };
