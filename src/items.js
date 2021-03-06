const mysql = require("mysql2/promise");
const config = require("../config.js");

/**
 * getList
 * 商品一覧を返却する処理
 *
 * @returns レスポンス JSON
 */
getListItem = async function () {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    const sql =
      // "SELECT * FROM t_task LEFT JOIN m_category ON t_task.category_id = m_category.category_id";
      "SELECT * FROM t_task LEFT JOIN m_category ON t_task.category_id = m_category.category_id ORDER BY deadline";
    let data = [];
    const [rows, fields] = await connection.query(sql, data);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * getItem
 * 商品情報を１件返却する処理
 *
 * @returns レスポンス JSON
 */
getItem = async function (id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    const sql = "SELECT * FROM t_task WHERE id=?";
    let data = [id];
    const [rows, fields] = await connection.query(sql, data);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * category_filter
 * カテゴリーに合致した商品一覧を返却する処理
 *
 * @returns レスポンス JSON
 */
categoryFilter = async function (category_id) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    const sql = "SELECT * FROM t_task WHERE category_id = ?";
    let data = [category_id];
    const [rows, fields] = await connection.query(sql, data);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * sortTasks
 * 商品一覧を指定した並び順で返却する処理
 *
 * @returns レスポンス JSON
 */
sortTasks = async function (sortBy) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    let sql = "";
    switch (sortBy) {
      case "0":
        sql = "SELECT * FROM t_task ORDER BY id";
        break;
      case "1":
        sql = "SELECT * FROM t_task ORDER BY deadline ASC";
        break;
      case "2":
        sql = "SELECT * FROM t_task ORDER BY deadline DESC";
        break;
      default:
        sql = "SELECT * FROM t_task ORDER BY deadline ASC";
        break;
    }
    const [rows, fields] = await connection.query(sql);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * searchItem
 * タスクをキーワードで検索して返却する処理
 *
 * @returns レスポンス JSON
 */
searchItem = async function (keyword) {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    const sql = "SELECT * FROM t_task WHERE task_name LIKE ?";
    keyword = "%" + keyword + "%";
    let data = [keyword];
    const [rows, fields] = await connection.query(sql, data);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * getTodayTask
 * 商品情報を１件返却する処理
 *
 * @returns レスポンス JSON
 */
getTodayTask = async function () {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    // SQL記述
    const sql =
      "SELECT * FROM t_task WHERE deadline >= CURDATE()  AND deadline < DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)";
    const [rows, fields] = await connection.query(sql);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

/**
 * getMonthlyTasks
 * カレンダー用にその月のタスクを取得
 *
 * @returns レスポンス JSON
 */
getMonthlyTasks = async function () {
  let connection = null;
  try {
    connection = await mysql.createConnection(config.dbSetting);
    let today = new Date();
    let thisYear = today.getFullYear();
    let thisMonth = today.getMonth() + 1;

    // 月の末日を取得
    today.setMonth(today.getMonth() + 1);
    today.setDate(0);
    let lastDayOfMonth = today.getDate();

    let minDate = `${thisYear}-${thisMonth}-1`;
    let maxDate = `${thisYear}-${thisMonth}-${lastDayOfMonth}`;
    // SQL記述
    const sql =
      "SELECT id, task_name, CAST(deadline AS DATE) AS deadline, task_status,category_id FROM t_task WHERE deadline >= ? AND deadline < ? ORDER BY deadline";
    let data = [minDate, maxDate];
    const [rows, fields] = await connection.query(sql, data);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
    connection.end();
  }
};

exports.getListItem = getListItem;
exports.getItem = getItem;
exports.categoryFilter = categoryFilter;
exports.searchItem = searchItem;
exports.sortTasks = sortTasks;
exports.getTodayTask = getTodayTask;
exports.getMonthlyTasks = getMonthlyTasks;
