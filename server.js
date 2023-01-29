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
const { default: axios } = require("axios");

// Dependências
const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// Definições do EJS
server.set('view engine', 'ejs');
server.set('views', './')

// Paginas
const public = process.env.PUBLIC_PATH

server.get('/', logged, (req, res) => {
    res.render(public+"index.ejs", {
        title : "Página Inicial"
    })
})

server.get('/login', (req, res) => {
    res.render(public+"login.ejs", {
        title : "Login"
    })
})

server.get('/cursos/:id', logged, (req, res) => {

    axios.get('/api/courses/get')

    res.render(public+"course", {
        list : courses
    })
})

// Rotas
server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body, res));
});
server.post('/api/users/desconect', async (req, res) => {
    res.send(await desconect(res));
});
server.get('/api/courses/get/:id', async(req, res) => {
    res.send(await get_course(res, id));
})



// Porta
server.listen(3030, () => {
    console.log("Server online");
});