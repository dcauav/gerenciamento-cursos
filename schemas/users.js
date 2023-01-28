
const mysql = require("mysql");
const config = require("../database/config.js");
const db = mysql.createConnection(config.databaseConfig);


// Busca os dados do usuário
async function find (email) {
    
    let query = "SELECT * FROM tbl_Users WHERE email_User LIKE ?";
    let variable = email;

    return new Promise((res, error) => {
        db.query(query, variable, (db_error, db_res) => {
            if(db_error)
            {
                return error(db_error);
            }
            return res(db_res);
        })
    }) 

}

module.exports = find