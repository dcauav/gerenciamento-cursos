// Imports do servidor
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require('dotenv').config()

// Controladores
const login = require("./controllers/users/login");
const logged = require("./controllers/users/logged");
const desconect = require("./controllers/users/desconect");

// Dependências
const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// Paginas
server.get('/', logged, (req, res) => res.sendFile(__dirname+"/public/index.html"))
server.get('/login', (req, res) => res.sendFile(__dirname+"/public/login.html"))

// Rotas
server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body, res));
});
server.post('/api/users/desconect', async (req, res) => {
    res.send(await desconect(res));
});

// Porta
server.listen(3030, () => {
    console.log("Server online");
});