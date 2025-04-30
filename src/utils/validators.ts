import Joi from "joi";

export const projectSchema = Joi.object({
  admin_id: Joi.string().min(4).required(),
  author_name: Joi.string().min(3).required(),
  project_title: Joi.string().min(5).required(),
  date_of_submission: Joi.date().iso().required(),
  abstract: Joi.string().min(10).required(),
  aims: Joi.string().min(10).required(),
  objectives: Joi.array().items(Joi.string().min(3)).min(1).max(20).required(),
  supervisor: Joi.string().min(3).required(),
});

export const editProjectSchema = Joi.object({
  admin_id: Joi.string().min(4).required(),
  author_name: Joi.string().min(3).optional(),
  project_title: Joi.string().min(5).optional(),
  date_of_submission: Joi.date().iso().optional(),
  abstract: Joi.string().min(10).optional(),
  aims: Joi.string().min(10).optional(),
  objectives: Joi.array().items(Joi.string().min(3)).min(1).max(20).optional(),
  supervisor: Joi.string().min(3).optional(),
});
