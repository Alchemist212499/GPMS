const joi = require("joi");
const { selectByColumn } = require("../config/db");

async function C_rpaCreateSchema() {
  const majorCodeSchema = await selectByColumn("Major", ["MajorCode"]);
  const majorCodeArray = majorCodeSchema.map((code) => code.MajorCode);
  console.log("majorCode:", majorCodeArray);
  const researchCodeSchema = await selectByColumn("Research", ["ResearchCode"]);
  const researchCodeArray = researchCodeSchema.map((code) => code.ResearchCode);
  console.log("researchCode:", researchCodeArray);

  const schema = joi.object({
    AdviserFID: joi.number().integer().required(),
    TargetMajorFCode: joi
      .string()
      .required()
      .valid(...majorCodeArray),
    //"Foreign Key Restraint not Qualified"
    ResearchFCode: joi
      .string()
      .required()
      .valid(...researchCodeArray),
    ResearchSpec: joi.string().required(),
  });
  return schema;
}

function P_rpaUpdateSchema() {
  const schema = joi.object({
    ApplicationID: joi.number().integer().required(),
    MoeVer: joi.number().required().valid(0, 1),
  });
  return schema;
}

module.exports = { C_rpaCreateSchema, P_rpaUpdateSchema };
