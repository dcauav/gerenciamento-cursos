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
const getCourse = require("./controllers/courses/get");

const createCourse = require("./controllers/courses/create")
const saveCourse = require("./controllers/courses/save")
const deleteCourse = require("./controllers/courses/delete")

const userSchema = require("./schemas/users")
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

server.get('/cursos/list/:page', logged, async (req, res) => {
    const page = req.params.page.split('=')[1];
    const courses = await axios.get('/api/courses/list/page=' + page).then(response => response.data);

    res.render(public+"course_list.ejs", {
        list : courses
    })
})

server.get('/cursos/create', async (req, res) => {
    const teachers = await axios.post('api/users/list').then(response => response.data);

    res.render(public+'course_create.ejs', {
        teachers: teachers
    })
})

server.get('/cursos/editar/:id', async (req, res) => {
    const teachers = await axios.post('api/users/list').then(response => response.data);

    const id = req.params.id.split('=')[1];
    const course = await axios.get('/api/courses/get/id='+id).then(response => response.data);

    res.render(public+'course_edit.ejs', {
        teachers: teachers,
        data : course
    })
})

server.get('/cursos/info/:id',  async (req, res) => {
    const id = req.params.id.split('=')[1];
    const course = await axios.get('/api/courses/get/id='+id).then(response => response.data);

    res.render(public+"course_info.ejs", {
        data : course
    });
});

// Rotas

// Usuarios
server.post('/api/users/login', async (req, res) => {
    res.send(await login(req.body, res));
});

server.post('/api/users/desconect', async (req, res) => {
    res.send(await desconect(res));
});

server.post('/api/users/list', async (req, res) => {
    res.send(await userSchema.findUserList())
})

// Cursos
server.get('/api/courses/list/:page', async(req, res) => {
    const page = req.params.page.split('=')[1];
    res.send(await getCourse.getCourList(res, page));
})

server.get('/api/courses/get/:id', async(req, res) => {
    const id = req.params.id.split('=')[1];
    res.send(await getCourse.getCourInfo(res, id));
})

server.post('/api/create/course', bodyParser.json(), (req, res) => {
    const data = req.body

    res.send(createCourse(data, res))
})

server.post('/api/save/course', bodyParser.json(), (req, res) => {
    const data = req.body

    res.send(saveCourse(data, res))
})

server.post('/api/delete/course', bodyParser.json(), (req, res) => {
    const id = req.body

    res.send(deleteCourse(id, res))
})

// Uploads
const formidable = require('formidable');
const fs = require('fs');
const path = require('path')

server.post('/api/upload/course', (req, res, next) => {
    // req.course_name.toLowerCase().replace(" ", "_") + "_" + new Date().getFullYear();

    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB
    
    form.parse(req, function(err, fields, files){    

        let newFilename = fields.course_name.toLocaleLowerCase().replaceAll(" ", "_") + ".jpg";
        let coursePath = fields.course_name.toLocaleLowerCase().replaceAll(" ", "_") + "_" +new Date().getFullYear();

        let newPath = path.join(__dirname, 'assets/img/cursos', coursePath, newFilename);
        fs.mkdirSync(path.join(__dirname, 'assets/img/cursos', coursePath), { recursive: true })

        let rawData = fs.readFileSync(files.course_image.filepath);
        
        fs.writeFile(newPath, rawData, function(err){
            if(err) console.log(err);
            return res.status(200).send(`/assets/img/cursos/${coursePath}/${newFilename}`);
        })
    })

})

// Assets

server.get('/assets/js/:folder/:script', (req, res) =>{
    res.sendFile(__dirname + '/assets/js/' + req.params.folder  + '/' + req.params.script)
})

server.get('/assets/img/:section/:folder/:image', (req, res) => {
    res.sendFile(__dirname + '/assets/img/' + req.params.section + '/' + req.params.folder  + '/' + req.params.image)
})

// Porta
server.listen(3030, () => {
    console.log("Server online");
});