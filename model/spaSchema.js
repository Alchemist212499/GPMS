const joi = require("joi");

async function C_spaCreateSchema() {
  const schema = joi.object({
    RequestedProjectFID: joi.number().integer().required(),
    RequestedStudentFID: joi.number().integer().required(),
  });
  return schema;
}

async function P_spaUpdateSchema() {
  const schema = joi.object({
    AdviserID: joi.number().integer().required(),
    RequestID: joi.number().integer().required(),
    RequestVer: joi.number().required().valid(0, 1),
  });
  return schema;
}

module.exports = { C_spaCreateSchema, P_spaUpdateSchema };
