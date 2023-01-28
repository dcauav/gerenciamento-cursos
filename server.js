// Imports do servidor
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

// Controladores

const login = require("./controllers/users/login");

// Dependências
const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());



// Rotas
server.get('/', (req, res) => res.sendFile(__dirname+"/public/index.html"))

server.get('/teste', (req, res) => {
    console.log("deu")
});

server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body));
});

// Porta
server.listen(3030, () => {
    console.log("Server online");
});