import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";
import {IGroup} from "../../types/group_type";

const bodySchemaForCreatingGroup = Joi.object({
  name: Joi.string().required(),
  permission: Joi.array().items(Joi.string().valid('READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES')).required()
});

interface CreateGroupSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: IGroup
}

export { bodySchemaForCreatingGroup, CreateGroupSchema };