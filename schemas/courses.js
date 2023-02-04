const config = require("../database/connection.js");

async function createCour (data) {
    let query = `INSERT INTO tbl_course (name_Cour, teacher_CourFK, category_Cour, desc_Cour, image_Cour, active_Cour) VALUES (?, ?, ?, ?, ?, true)`;

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

async function saveCour (data) {
    let query = `UPDATE tbl_course SET name_Cour = ?, teacher_CourFK = ?, category_Cour = ?, desc_Cour = ?, image_Cour= ? WHERE id_Cour = ?`;

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

async function deleteCour (id) {
    let query = `DELETE FROM tbl_course WHERE id_Cour = ${id}`;
   
    return new Promise((res, error) => {
        config.query(query, (db_error, db_res) => {
            if(db_error)
            {
                return error({state: {info: "error", desc: db_error}});
            }
            return res({state: {info: "success"}});
        });
    });
}

async function switchCour (data) {
    let query = `UPDATE tbl_course SET active_Cour=${data.active} WHERE id_Cour = ${data.id}`;
   
    return new Promise((res, error) => {
        config.query(query, (db_error, db_res) => {
            if(db_error)
            {
                return error({state: {info: "error", desc: db_error}});
            }
            return res({state: {info: "success"}});
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

async function findCourSearch (search) {
    let query = `SELECT * FROM tbl_course WHERE name_Cour Like '${search}%'`;
   
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

async function findCourList () {
    let query = `SELECT * FROM tbl_course  ORDER BY desc_Cour ASC, name_Cour ASC`;

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
    deleteCour,
    saveCour,
    switchCour,
    findCour,
    findCourSearch,
    findCourList
};
