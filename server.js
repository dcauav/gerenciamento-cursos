// Imports do servidor
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Conexão com o banco de dados
const mysql = require("mysql")
const db_config = require(__dirname+"/database/config.js")
const db = mysql.createConnection(db_config.databaseConfig)

// Dependências
const server = express();

server.use(cors());
server.use(bodyParser.json);
server.use(cookieParser());

// Porta
server.listen(3000);

// Rotas
server.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html"))

server.get('/teste', (req, res) => {

    result = db.query("SELECT * FROM tbl_agenda", function(err, results, fields) {
        res.json(results)
    });

});

server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body));
});

