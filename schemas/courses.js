const config = require("../database/connection.js");

async function createCour (data) {
    let query = `INSERT INTO tbl_course (name_Cour, teacher_CourFK, category_Cour, desc_Cour, image_Cour) VALUES (?, ?, ?, ?, ?)`;

    return new Promise((res, error) => {
        config.query(query, data, (db_error, db_res) => {
            if(db_error)
            {
                return error(db_error);
            }
            return res(db_res[0]);
        });
    });
}

// Busca os dados do usuário
async function findCour(id) {

    let query = `SELECT C.*, U.name_User FROM tbl_Course AS C INNER JOIN tbl_Users AS U WHERE C.teacher_CourFK = U.id_User AND id_Cour = ${id}`;

    return new Promise((res, error) => {
        config.query(query, (db_error, db_res) => {
            if(db_error)
            {
                return error(db_error);
            }
            return res(db_res[0]);
        });
    });
}

async function findCourList (page) {
    let min_list = 0;
    let max_list = 0;

    (page == 1) ? min_list = 0 : min_list = (page - 1) * 9

    max_list = min_list + 9;

    let query = `SELECT * FROM tbl_course LIMIT ${min_list}, ${max_list}`;

    return new Promise((res, error) => {
        config.query(query, (db_error, db_res) => {
            if(db_error)
            {
                return error(db_error);
            }
            return res(db_res);
        });
    });
}

module.exports = {
    createCour,
    findCour,
    findCourList
};
