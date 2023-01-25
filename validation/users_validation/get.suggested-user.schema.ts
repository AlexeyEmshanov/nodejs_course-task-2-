import * as Joi from "joi";
import {ContainerTypes, ValidatedRequestSchema} from "express-joi-validation";

const querySchemaForSuggestedUser = Joi.object({
  loginSubstring: Joi.string().required(),
  limit: Joi.number().required()
});

interface SuggestedUserSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    loginSubstring: string,
    limit: number
  }
}

export { querySchemaForSuggestedUser, SuggestedUserSchema };