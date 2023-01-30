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
// Usuarios
const login = require("./controllers/users/login");
const logged = require("./controllers/users/logged");
const desconect = require("./controllers/users/desconect");
const tokendata = require("./controllers/users/tokendata");

// Cursos
const getCourse = require("./controllers/courses/get");
const createCourse = require("./controllers/courses/create")
const saveCourse = require("./controllers/courses/save")
const deleteCourse = require("./controllers/courses/delete")
const switchCourse = require("./controllers/courses/switch")

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
const url_p = process.env.URL_PATH;

server.get('/login', (req, res) => {
    res.render(public+"login.ejs", {
        title : "Login"
    });
});

server.get('/', logged, async (req, res) => {
        
    const courses = await axios.get('/api/courses/list').then(response => response.data);

    const user = await tokendata(req, res)

    res.render(public+"course_list.ejs", {
        title : "Cursos",
        list : courses,
        user : user
    })
})

server.get('/:search', logged, async (req, res) => {
    const search = req.params.search.split('=')[1];
    
    const courses = await axios.get('/api/courses/list/search=' + search).then(response => response.data);

    const user = await tokendata(req, res)

    res.render(public+"course_list.ejs", {
        title : "Pesquisando...",
        list : courses,
        user : user
    })
})

server.get('/cursos/create', logged, async (req, res) => {
    const teachers = await axios.post('api/users/list').then(response => response.data);

    const user = await tokendata(req, res)
    res.render(public+'course_create.ejs', {
        title : "Criando curso...",
        teachers: teachers,
        user: user
    })
})

server.get('/cursos/editar/:id', logged, async (req, res) => {
    const teachers = await axios.post('api/users/list').then(response => response.data);

    const id = req.params.id.split('=')[1];
    const course = await axios.get('/api/courses/get/id='+id).then(response => response.data);
    if(!course){
        res.status(404).send('Não foi possível encontrar esse curso')
    }
    const user = await tokendata(req, res)
    res.render(public+'course_edit.ejs', {
        title : "Editando curso...",
        teachers: teachers,
        data : course,
        user : user
    })
})

server.get('/cursos/info/:id', logged, async (req, res) => {
    const id = req.params.id.split('=')[1];
    const course = await axios.get('/api/courses/get/id='+id).then(response => response.data);
    if(!course){
        res.status(404).send('Não foi possível encontrar esse curso')
    }
    const user = await tokendata(req, res)
    res.render(public+"course_info.ejs", {
        title : "Informações do Curso",
        data : course,
        user : user
    });
});

// Rotas

// Usuarios
server.post('/api/users/login', bodyParser.json(), async (req, res) => {
    const data = req.body

    if(data.email == "" || data.password == "")
    {
        return res.status(404).send({error:{desc: 'Parâmetros não fornecidos, ou estão errados.'}});
    }
    res.status(200).send(await login(data, res));
});

server.post('/api/users/desconect', async (req, res) => {
    res.send(await desconect(res));
});

server.post('/api/users/list', async (req, res) => {
    res.send(await userSchema.findUserList())
})

// Cursos
server.get('/api/courses/list', async(req, res) => {
    res.send(await getCourse.getCourList(res));
})

// Lista 9 cursos com base no número do parâmetro <page>
server.get('/api/courses/list/:search', async(req, res) => {
    const search = req.params.search.split('=')[1];
    
    if(!search ){
        return res.send(await getCourse.getCourSearch(res, '@returnnulldata'));
    }

    res.send(await getCourse.getCourSearch(res, search));

})

// Lista as informações de um cursos com base no <id>
server.get('/api/courses/get/:id', async(req, res) => {
    const id = req.params.id.split('=')[1];

    if(!id || !Number.parseInt(id)){
        return res.status(404).send({error:{desc: 'Parâmetros não fornecidos, ou estão errados.'}});
    }

    res.send(await getCourse.getCourInfo(res, id));
})

// Cria um curso novo
server.post('/api/create/course', bodyParser.json(), async (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(404).send({error:{desc: 'Parâmetros não fornecidos.'}});
    }

    res.status(200).send(await createCourse(data, res));
})

// Salva alterações em um cursos já existente
server.post('/api/save/course', bodyParser.json(), async (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(404).send({error:{desc: 'Parâmetros não fornecidos.'}});
    }

    res.status(200).send(await saveCourse(data, res));
})

// Deleta um curso
server.post('/api/delete/course', bodyParser.json(), async (req, res) => {
    const id = JSON.stringify(req.body.id);

    if (!id) {
        return res.status(404).send({error:{desc: 'Parâmetro não fornecido.'}});
    }
    res.status(200).send(await deleteCourse(id, res));
})

// Ativa/desativa um curso
server.post('/api/switch/course', bodyParser.json(), async (req, res) => {
    const data = req.body;

    if (!data.id) {
        return res.status(404).send({error:{desc: 'Parâmetro não fornecido.'}});
    }

    res.status(200).send(await switchCourse(data, res));
})

// Uploads

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

server.post('/api/upload/course', (req, res, next) => {
    // req.course_name.toLowerCase().replace(" ", "_") + "_" + new Date().getFullYear();

    const form = new formidable.IncomingForm();
    form.multiples = false;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB
    
    form.parse(req, async function(err, fields, files){    
        if(!fields.course_name || !files.course_image)
        {
            return res.status(404).send({error:{desc: 'Parâmetros não fornecidos.'}});
        }
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

server.get('/assets/css/:css', (req, res) =>{
    res.sendFile(__dirname + '/assets/css/' + req.params.css)
})

server.get('/assets/js/:folder/:script', (req, res) =>{
    res.sendFile(__dirname + '/assets/js/' + req.params.folder  + '/' + req.params.script)
})

server.get('/assets/img/:section/:image', (req, res) => {
    res.sendFile(__dirname + '/assets/img/' + req.params.section + '/' + req.params.image)
})

server.get('/assets/img/:section/:folder/:image', (req, res) => {
    res.sendFile(__dirname + '/assets/img/' + req.params.section + '/' + req.params.folder  + '/' + req.params.image)
})

// Porta
server.listen(3030, () => {
    console.log("Server online");
});