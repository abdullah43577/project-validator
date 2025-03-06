import Joi from "joi";

export const projectSchema = Joi.object({
  author_name: Joi.string().min(3).max(50).required(),
  project_title: Joi.string().min(5).max(100).required(),
  date_of_submission: Joi.date().iso().required(),
  abstract: Joi.string().min(10).max(500).required(),
  aims: Joi.string().min(10).max(500).required(),
  objectives: Joi.array().items(Joi.string().min(3).max(200)).min(1).max(20).required(),
  supervisor: Joi.string().min(3).max(50).required(),
});

export const editProjectSchema = Joi.object({
  author_name: Joi.string().min(3).max(50).optional(),
  project_title: Joi.string().min(5).max(100).optional(),
  date_of_submission: Joi.date().iso().optional(),
  abstract: Joi.string().min(10).max(500).optional(),
  aims: Joi.string().min(10).max(500).optional(),
  objectives: Joi.array().items(Joi.string().min(3).max(200)).min(1).max(20).optional(),
  supervisor: Joi.string().min(3).max(50).optional(),
});
