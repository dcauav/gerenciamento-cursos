// Imports do servidor
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { default: axios } = require("axios");

// Config .env
require('dotenv').config();

// Config axios

axios.defaults.baseURL = 'http://localhost:3030';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Controladores
const login = require("./controllers/users/login");
const logged = require("./controllers/users/logged");
const desconect = require("./controllers/users/desconect");
const getCourse = require("./controllers/courses/get.js");

// Dependências
const server = express();

server.use(cors());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// Definições do EJS
server.set('view engine', 'ejs');
server.set('views', './');

// Paginas
const public = process.env.PUBLIC_PATH;

server.get('/', logged, (req, res) => {
    
    res.render(public+"index.ejs", {
        title : "Página Inicial"
    });
});

server.get('/login', (req, res) => {
    res.render(public+"login.ejs", {
        title : "Login"
    });
});

server.get('/cursos/:page', logged, async (req, res) => {
    const page = req.params.page.split('=')[1];
    const courses = await axios.get('/api/courses/list/page=' + page).then(response => response.data);

    res.render(public+"course_list.ejs", {
        list : courses
    })
})

server.get('/cursos/info/:id', logged, async (req, res) => {
    const id = req.params.id.split('=')[1];
    const course = await axios.get('/api/courses/get/id='+id).then(response => response.data);

    res.render(public+"course_info.ejs", {
        data : course
    });
});

// Rotas
server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body, res));
});

server.post('/api/users/desconect', async (req, res) => {
    res.send(await desconect(res));
});

server.get('/api/courses/list/:page', async(req, res) => {
    const page = req.params.page.split('=')[1];

    res.send(await getCourse.getCourList(res, page));
})

server.get('/api/courses/get/:id', async(req, res) => {
    const id = req.params.id.split('=')[1];
    res.send(await getCourse.getCourInfo(res, id));
})

// Porta
server.listen(3030, () => {
    console.log("Server online");
});