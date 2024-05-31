require("dotenv").config();
const { func } = require("joi");
const mysql = require("mysql2/promise");
const mysqlPool = mysql.createPool({
  host: "localhost",
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: "gpms",
});

//process.env.DATABASE_PASSWORD

async function selectByColumn(table, columns) {
  const sqlColumns = `(${columns.join(", ")})`;
  const sql = `SELECT ${sqlColumns} FROM ${table} `;
  console.log("this is the sql:", sql);
  try {
    const [results, fields] = await mysqlPool.query(sql);
    return results;
  } catch (err) {
    console.error(err);
  }
}

async function findByColumn(table, column, param) {
  const sql = `SELECT * FROM ${table} WHERE ${column} = ? `;
  const params = [...param];
  try {
    const [results, fields] = await mysqlPool.query(sql, params);
    //console.log("here is the result:", results);
    return results;
  } catch (err) {
    console.error(err);
  }
}

async function selectAll(table) {
  const sql = `SELECT * FROM ${table}`;
  try {
    const [results, fields] = await mysqlPool.query(sql);
    return results;
  } catch (err) {
    console.error(err);
  }
}

async function save(table, srcColumn, dstColumn, param) {
  const sql = `UPDATE ${table} SET ${dstColumn} = ? WHERE ${srcColumn} = ?;`;
  console.log("params:", param);
  try {
    const [results, fields] = await mysqlPool.query(sql, param);
    return results;
  } catch (err) {
    console.error(err);
  }
}

async function insert(table, columns, values) {
  const sqlTable = `INSERT INTO ${table}`;
  const sqlColumns = `(${columns.join(", ")})`;
  const quotedValues = values.map((value) => `"${value}"`);
  const sqlValues = ` VALUE(${quotedValues.join(", ")});`;
  const sql = sqlTable + sqlColumns + sqlValues;
  try {
    const [results, fields] = await mysqlPool.query(sql);
    return results;
  } catch (err) {
    console.log("in db.js", err);
    console.log("this is the sqlMessage:", err.sqlMessage);
    return { error: err.sqlMessage };
  }
}

async function update(table, keys, values, columns, params) {
  const sqlTable = `UPDATE ${table}`;
  const sqlPairs = keys.map((key, index) => `${key} = "${values[index]}"`);
  const sqlCondition = columns.map(
    (column, index) => `${column} = "${params[index]}"`
  );
  const sql =
    sqlTable +
    ` SET ${sqlPairs.join(", ")}` +
    ` WHERE ${sqlCondition.join(", ")};`;
  try {
    const [results, fields] = await mysqlPool.query(sql);
    return results;
  } catch (err) {
    console.log("in db.js", err);
    console.log("this is the sqlMessage:", err.sqlMessage);
    return { error: err.sqlMessage };
  }
}

async function call(stored_procedure, param) {
  const params = [...param];
  const sqlParams = `(${params.join(", ")});`;
  const sql = `CALL ${stored_procedure}` + sqlParams;
  console.log(sql);
  try {
    const [results, fields] = await mysqlPool.query(sql);
    console.log(results);
    return results;
  } catch (err) {
    console.log("in db.js", err);
    console.log("this is the sqlMessage:", err.sqlMessage);
    return { error: err.sqlMessage };
  }
}

module.exports = {
  selectByColumn,
  findByColumn,
  selectAll,
  save,
  insert,
  update,
  call,
};
