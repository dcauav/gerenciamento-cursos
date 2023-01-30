
const config = require("../database/connection.js");

// Busca os dados do usuário
async function findUser (email) {
    
    let query = "SELECT * FROM tbl_Users WHERE email_User LIKE ?";
    let variable = email;

    return new Promise((res, error) => {
        config.connect(function(err) {
            config.query(query, variable, (db_error, db_res) => {
                if(db_error)
                {
                    return error(db_error);
                }
                return res(db_res);
            })
        });
    });
}

async function findUserList () {
    let query = "SELECT id_User, name_User FROM tbl_Users";

    return new Promise((res, error) => {
        config.connect(function(err) {
            config.query(query, (db_error, db_res) => {
                if(db_error)
                {
                    return error(db_error);
                }
                return res(db_res);
            })
        });
    });
}

module.exports = {
    findUser,
    findUserList
};

