const {
  selectAll,
  insert,
  update,
  call,
  findByColumn,
} = require("../config/db");
const { C_spaCreateSchema, P_spaUpdateSchema } = require("../model/spaSchema");

const getAllspaRecords = async (req, res) => {
  //const spaRecords = await call("tcr_rel_spaRecs", [req.body.AdviserID]);
  const spaRecords = await findByColumn("spa_view", "AdviserFID", [
    req.body.AdviserID,
  ]);
  console.log("getAllspaRecords>", spaRecords);
  if (!spaRecords.length) {
    return res.status(400).json({ message: "No spa Records found" });
  }
  res.json({ message: "spaRecords fetched!", info: spaRecords });
};

const createNewspaRecord = async (req, res) => {
  const spaCreateSchema = await C_spaCreateSchema();
  const result = spaCreateSchema.validate(req.body, { abortEarly: false });
  if (result.error) {
    return res.status(400).json({ message: result.error.details });
  }

  const rst = await insert(
    "SPA",
    Object.keys(req.body),
    Object.values(req.body)
  );
  if (rst.error) {
    res.status(400).json({ message: rst.error });
  } else {
    res.status(201).json({
      message: "New spaRecord created successfully!",
      info: result.value,
    });
  }
};

/* const updatespaRecord = async (req, res) => {
  if (req.body.RequestVer === true) {
    req.body.RequestVer = 1;
  } else if (req.body.RequestVer === false) {
    req.body.RequestVer = 0;
  }
  const spaUpdateSchema = await P_spaUpdateSchema();
  const result = spaUpdateSchema.validate(req.body, { abortEarly: false });
  if (result.error) {
    return res.status(400).json({ message: result.error.details });
  }

  const rst = await call("update_spa_RequestVer", Object.values(req.body));
  if (rst.error) {
    res.status(400).json({ message: rst.error });
  } else {
    console.log("rst:", rst);
    if (rst[0]?.length) {
      res.status(201).json({
        message: "spaRecord updated successfully!",
        info: result.value,
      });
    } else {
      res
        .status(404)
        .json({ message: "RequestID not found...", info: result.value });
    }
  }
}; */
//如果对于某一个request的requestver更新为1了，
//那么将spa表中所有与该request列中对应的requestedprojectFID的数据项的requestver全部设置成0
const updatespaRecord = async (req, res) => {
  if (req.body.RequestVer === true) {
    req.body.RequestVer = 1;
    // 通过使用req中的RequestID查找spa表，判断此条记录是否存在
    const isValid = await findByColumn("spa", "RequestID", [
      req.body.RequestID,
    ]);
    console.log("isValid>", isValid);
    // 如果此条记录存在，则运行'preflip'逻辑，即将满足req中RequestID所有相同RequestedProjectFID的记录的RequestVer字段全部置为0
    // 从而达到同一个课题只能有一个学生的申请被教师选中的目的
    if (isValid.length) {
      const preflip = await update(
        "spa",
        ["RequestVer"],
        [0],
        ["RequestedProjectFID"],
        [isValid[0].RequestedProjectFID]
      );

      console.log("preflip>", preflip);
    }
    // 如果此条记录不存在（req中的数据传输错误），则不会对spa的RequestVer字段进行更改，下面代码将会抛出错误
  } else if (req.body.RequestVer === false) {
    req.body.RequestVer = 0;
  }
  const spaRecord = await update(
    "spa",
    ["RequestVer"],
    [req.body.RequestVer],
    ["RequestID"],
    [req.body.RequestID]
  );
  console.log("spaRecord>", spaRecord);
  if (spaRecord.error) {
    res.status(400).json({ message: spaRecord.error });
  } else {
    if (spaRecord.affectedRows) {
      const updatedspaRecords = await findByColumn("spa_view", "AdviserFID", [
        req.body.AdviserFID,
      ]);
      console.log("updatedspaRecords>", updatedspaRecords);
      res.status(201).json({
        message: "spaRecord updated successfully!",
        info: updatedspaRecords,
      });
    } else {
      res
        .status(404)
        .json({ message: "RequestID not found...", info: spaRecord });
    }
  }
};

module.exports = {
  getAllspaRecords,
  createNewspaRecord,
  updatespaRecord,
};
