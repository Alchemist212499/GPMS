/* function update(table, keys, values, columns, params) {
  const sqlTable = `UPDATE ${table}`;
  console.log("keys:", keys);
  const sqlPairs = keys.map((key, index) => `${key} = "${values[index]}"`);
  const sqlCondition = columns.map(
    (column, index) => `${column} = "${params[index]}"`
  );
  const sql =
    sqlTable +
    ` SET ${sqlPairs.join(", ")}` +
    ` WHERE ${sqlCondition.join(", ")};`;
  console.log(sql);
}

const req = {
  body: { ScoredStudentFID: 22050208, ScorePre: 97, ScoreFinal: 87 },
};

update(
  "RPA",
  Object.keys(req.body).slice(1),
  Object.values(req.body).slice(1),
  [Object.keys(req.body)[0]],
  [Object.values(req.body)[0]]
);

console.log(Object.keys(req.body));
console.log(Object.values(req.body)); */

const req = {
  body: { ScoredStudentFID: 22050208 },
};

function findByColumn(table, column, param) {
  const sql = `SELECT * FROM ${table} WHERE ${column} = ? `;
  const params = [...param];
  console.log("params:", params);
  console.log(sql);
}

const rst = findByColumn("score", "ScoredStudentFID", [
  req.body.ScoredStudentFID,
]);
