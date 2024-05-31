/* 创建存储过程 输入参数为进行审核操作的教师ID 目标申请ID 审核状态*/ CREATE PROCEDURE update_spa_RequestVer (
    IN OP_AdviserID INT UNSIGNED,
    IN OP_RequestID INT UNSIGNED,
    IN OP_RequestVer TINYINT (1) UNSIGNED
) BEGIN
/* */
/* */
/* 声明变量 */
DECLARE var_Pre_RequestVer TINYINT (1) UNSIGNED;

DECLARE var_RequestedProjectFID INT UNSIGNED;

/* */
/* */
/* 创建临时表 */
DROP TEMPORARY TABLE IF EXISTS temp_tcr_rel_spaRecs;

CREATE TEMPORARY TABLE temp_tcr_rel_spaRecs (
    RequestID INT UNSIGNED,
    RequestedProjectFID INT UNSIGNED,
    RequestedStudentFID INT UNSIGNED,
    RequestVer TINYINT (1) UNSIGNED
);

INSERT INTO
    temp_tcr_rel_spaRecs
SELECT
    spa.RequestID,
    spa.RequestedProjectFID,
    spa.RequestedStudentFID,
    spa.RequestVer
FROM
    rpa
    INNER JOIN rps ON rpa.ApplicationID = rps.ApplicationFID
    INNER JOIN spa ON rps.SummaryID = spa.RequestedProjectFID
WHERE
    rpa.AdviserFID = OP_AdviserID;

/* */
/* */
/* 验证该临时表是否为空表 */
IF (
    SELECT
        COUNT(*)
    FROM
        temp_tcr_rel_spaRecs
) THEN
/* 定义进行更新前的RequestVer字段值 */
SET
    var_Pre_RequestVer = (
        SELECT
            RequestVer
        FROM
            temp_tcr_rel_spaRecs
        WHERE
            RequestID = OP_RequestID
    );

SET
    var_RequestedProjectFID = (
        SELECT
            RequestedProjectFID
        FROM
            temp_tcr_rel_spaRecs
        WHERE
            RequestID = OP_RequestID
    );

/* 需要更新的记录RequestVer字段与之前不同 并且更新前的RequestVer字段必须为空 */
IF (
    NOT (OP_RequestVer <= > var_Pre_RequestVer)
    AND ISNULL (var_Pre_RequestVer)
) THEN
/* 判断是否将要把此条记录的RequestVer字段更改为1 */
IF OP_RequestVer = 1 THEN
/* 判断更新的记录对应的所有RequestedProjectFID是否有RequestVer字段值为1 */
IF EXISTS (
    SELECT
        *
    FROM
        temp_tcr_rel_spaRecs
    WHERE
        RequestedProjectFID <= > var_RequestedProjectFID
        AND RequestVer <= > 1
) THEN
DROP TEMPORARY TABLE temp_tcr_rel_spaRecs;

SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'This project has already been designated to a student.';

/* 相同的RequestedProjectFID的RequestVer字段有1 则报错 */
ELSE
UPDATE spa
SET
    RequestVer = 1
WHERE
    RequestID = OP_RequestID;

UPDATE temp_tcr_rel_spaRecs
SET
    RequestVer = 1
WHERE
    RequestID = OP_RequestID;

END IF;

ELSE
UPDATE spa
SET
    RequestVer = 0
WHERE
    RequestID = OP_RequestID;

UPDATE temp_tcr_rel_spaRecs
SET
    RequestVer = 0
WHERE
    RequestID = OP_RequestID;

END IF;

/* 需要更新的记录RequestVer字段与之前相同 */
/* */
/* */
/* 执行报错语句 */
ELSE
DROP TEMPORARY TABLE temp_tcr_rel_spaRecs;

SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'RequestVer has already been updated before.';

END IF;

/* */
/* */
/*若临时表为空表 则报错*/
ELSE
DROP TEMPORARY TABLE temp_tcr_rel_spaRecs;

SIGNAL SQLSTATE '45000'
SET
    MESSAGE_TEXT = 'There is no relavant spaRecords for this adviser.';

END IF;

/* */
/* */
/* 返回结果 */
SELECT
    *
FROM
    temp_tcr_rel_spaRecs;

-- DROP TEMPORARY TABLE temp_tcr_rel_spaRecs;
END;

/* */
/* */
/* */
CALL update_spa_RequestVer (23759148, 7, TRUE);

/* 删除 update_spa_RequestVer 存储过程 */
DROP PROCEDURE update_spa_RequestVer;