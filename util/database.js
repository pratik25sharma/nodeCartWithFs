const mysql = require("mysql2");

const pool = mysql.createPool({
    host: 'localhost',
    user:"root",
    database: 'node_practice',
    password : 'admin'
});

module.exports = pool.promise();