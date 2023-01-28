var mysql = require('mysql');

var con = mysql.createConnection({
    host     : 'localhost',
    database : 'grc_cursos',
    user     : 'root',
    password : '',
    port     : '3306'
});

module.exports = con;