const wbtoken = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const config = require("../../database/connection.js");
const schema = require("../../schemas/users.js");

// Verifica se o email existe na base de dados
async function verifyEmail (email)
{   
    return new Promise((res) => {
        let query = "SELECT email_User FROM tbl_Users WHERE email_User LIKE ?";
        let variable = email;
        
        config.query(query, variable, function (db_error, db_res) {
            if(!db_error) {
                if(db_res != '')
                {
                    return res(true);
                } 
            }
            else {
                console.log(db_error)
            }
            return res(false);
        })
    }) 
}

// Requisita o hash da base de dados 
async function getDB_pass (email)
{
    return new Promise ((res) => {
        let query = "SELECT password_User FROM tbl_Users WHERE email_User LIKE ?";
        let variable = email;

        config.query(query, variable, function (db_error, db_res) {
            if(!db_error) {
                if(db_res) {
                    return res(db_res[0].password_User);
                }  
            }
            else {
                console.log(db_error)
            }
            return res(false);
        })
    });
}

async function verifyPassword (inputPass, dbPass)
{
    return new Promise((res) => {
        // Caso não tenha encontrado a senha
        if(!dbPass) {
            return res(dbPass);
        }
        bcrypt.compare(inputPass, dbPass, function(error, result) {
            if (error) {
                return res(false);
            }
            else {
                return res(result);
            }
        });
    })
}

async function login (body, res)
{

    let email = body.email;
    let password = body.password;

    if(!email || !password) {

        return {error: 'Preencha todos os campos.'};
    }

    // Verifica Email e Senha
    const email_check = await verifyEmail(email);

    if(!email_check)
    {
        return {error:{login: 'Email ou senha incorretos.'}};
    }

    const hashed = await getDB_pass(email);
    const password_check = await verifyPassword(password, hashed)

    if (!password_check)
    {
        return {error:{login: 'Email ou senha incorretos.'}};
    }
    
    
    const data = await schema.findUser(email)
    
    // Criação do Token de Login
    const Token = await wbtoken.sign({
        id: `${data[0]['id_User']}`,
        name: `${data[0]['name_User']}`
    }, process.env.WBTOKEN_PASS);

    // Retorno de TOKEN 
    res.cookie('Token', Token)
    res.sendStatus(200)

    return;
}

module.exports = login
