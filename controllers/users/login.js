const wbtoken = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const mysql = require("mysql");
const config = require("../../database/config.js");
const db = mysql.createConnection(config.databaseConfig);

function verifyEmail (email)
{   
    let error = false;

    db.query("SELECT email_User FROM tbl_Users WHERE email_User = '" + email + "'", function (db_error, db_res, db_fields){
        if(!db_res[0].email_User)
        {
            error = true;
        }  
    });

    return error;
}

function getDB_pass (email)
{
    db.query("SELECT password_User FROM tbl_Users WHERE email_User = '" + email + "'", function (db_error, db_res, db_fields){
        if(db_res[0].password_User)
        {
            pass = db_res[0].password_User;
            return pass;
        }  
        else 
        {
            // Caso não encontre a senha
            return true;
        }
    });
}

async function verifyPassword (inputPass, dbPass)
{
    // Caso não tenha encontrado a senha
    if(dbPass == true)
    {
        return dbPass;
    }

    const compare = await bcrypt.compare(inputPass, dbPass, function(error, result) {
        if (error) {
            return {error: error};
        }
        else {
            return result;
        }
    })

}

async function login (body)
{

    let email = body.email;
    let password = body.password;

    if(!email || !password)
    {
        return {error: 'Preencha todos os campos.'};
    }

    let error = false;

    // Verifica Email e Senha
    switch (error)
    {
        case verifyEmail(db) == false:
        case verifyPassword(password, getDB_pass(email, db)) == false:
        {
            error = true;
            return error;
        }
    }
    let user_data;

    db.query("SELECT id_User, name_User FROM tbl_Users WHERE email_User = '" + email + "'", function (db_error, db_res, db_fields) {
        user_data = db_res;
    })

    db.end();

    const Token = await wbtoken.sign({
        id: user_data[0].id_User,
        name: user_data[0].name_User
    }, '@secretpass_2023@');
    res.cookie('Token', Token)
    res.sendStatus(200)
    // Retorno de TOKEN   
}
module.exports = login
