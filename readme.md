# Documentação - GRC Cursos

## Info

O projeto foi feito utilizando NodeJS, junto ao seguintes módulos:

- Express;
- Cors;
- BodyParser;
- CookieParser;
- JSON-Web-Token;
- BCrypt;
- MySQL;

**Para testar o projeto, utilize para login:**

Email: professor@teste.com

Senha: admin@123


## Instalando

### Depêndencias

Para rodar o projeto será necessário:

- NodeJS ^18.14.0;
- Servidor MySQL para o banco de dados;

### Iniciando

Ao baixar o projeto, importe o arquivo grc_cursos.sql da pasta raiz para o MySQL. 
> Após a importação, realize a configuração de conexão no arquivo connection.js da pasta '/database'.

Para iniciar o servidor, abra um terminal na pasta onde está instalado o projeto e utilize o comando 'npm run dev'.
> Atenção: O servidor irá iniciar na URL 'http://localhost:3030'.

> Observação: É possível alterar a porta da URL ao final do arquivo server.js na pasta raiz.

## Rotas

### Funcionamento

Todas as rotas do projeto são definidas no arquivo server.js da pasta raiz.

> Este projeto utiliza o módulo express para roteamento.

### Chamadas de API

Estão definidas no arquivo server.js, rotas de chamada de api. 
Todas as requisições são feitas via axios.

**Usuários**

Realiza uma tentativa de login utilizando os parâmetros {email: (string), password: (string)}.
```
    server.post('/api/users/login', bodyParser.json(), async (req, res) => {
        const data = req.body

        if(data.email == "" || data.password == "")
        {
            return res.status(404).send({error:{desc: 'Parâmetros não fornecidos, ou estão errados.'}});
        }
        res.status(200).send(await login(data, res));
    });
```

Realiza o 'logout' do usuário.
```
    server.post('/api/users/desconect', async (req, res) => {
        res.send(await desconect(res));
    });
```

Retorna uma lista com todos os usuários cadastros no banco.
```
    server.post('/api/users/list', async (req, res) => {
        res.send(await userSchema.findUserList())
    })
```

**Cursos**

Devolve uma lista com todos os cursos cadastrados.
```
    server.get('/api/courses/list', async(req, res) => {
        res.send(await getCourse.getCourList(res));
    })
```

Devolve uma lista de cursos com base no parâmetro GET '?search=(any)'.
```
    server.get('/api/courses/list/:search', async(req, res) => {
        const search = req.params.search.split('=')[1];
        
        if(!search ){
            return res.send(await getCourse.getCourSearch(res, '@returnnulldata'));
        }

        res.send(await getCourse.getCourSearch(res, search));

    })
```

Lista as informações de um cursos com base no parâmetro {id: (int)}.
```
    server.get('/api/courses/get/:id', async(req, res) => {
        const id = req.params.id.split('=')[1];

        if(!id || !Number.parseInt(id)){
            return res.status(404).send({error:{desc: 'Parâmetros não fornecidos, ou estão errados.'}});
        }

        res.send(await getCourse.getCourInfo(res, id));
    })
```

Cria um curso novo com base nos dados fornecidos pela página '/public/course_create.ejs'.
```
    server.post('/api/create/course', bodyParser.json(), async (req, res) => {
        const data = req.body;

        if (!data) {
            return res.status(404).send({error:{desc: 'Parâmetros não fornecidos.'}});
        }

        res.status(200).send(await createCourse(data, res));
    })
```

Salva alterações em um cursos já existente com base nos dados fornecidos pela página '/public/course_edit.ejs'.
```
    server.post('/api/save/course', bodyParser.json(), async (req, res) => {
        const data = req.body;

        if (!data) {
            return res.status(404).send({error:{desc: 'Parâmetros não fornecidos.'}});
        }

        res.status(200).send(await saveCourse(data, res));
    })
```

Deleta um curso com base no parâmetro {id: (int)}.
```
    server.post('/api/delete/course', bodyParser.json(), async (req, res) => {
        const id = JSON.stringify(req.body.id);

        if (!id) {
            return res.status(404).send({error:{desc: 'Parâmetro não fornecido.'}});
        }
        res.status(200).send(await deleteCourse(id, res));
    })
```

Ativa/Desativa um Curso com base nos parâmetros {id: (int), active: (bool)}.
```
    server.post('/api/switch/course', bodyParser.json(), async (req, res) => {
        const data = req.body;

        if (!data.id) {
            return res.status(404).send({error:{desc: 'Parâmetro não fornecido.'}});
        }

        res.status(200).send(await switchCourse(data, res));
    })
```

### Assets

Para requisitar um arquivo da pasta assets, um caminho pode ser estabelecido a partir de parâmetros pré-requisitados nas rotas.

```
    server.get('/assets/img/:section/:folder/:image', (req, res) => {
        res.sendFile(__dirname + '/assets/img/' + req.params.section + '/' + req.params.folder  + '/' + req.params.image)
    })
```

> Nesse exemplo, a rota segue a partir do caminho '/assets/img' utilizando nomes de subdiretórios na url (/:section/:folder) e por fim o nome do arquivo (/:img). Ou seja, uma url como 'http://localhost:3030/assets/img/cursos/exemplo/exemplo.jpeg', retornaria a imagem exemplo.jpeg.

> Atenção: Caminhos com mais ou menos diretórios devem ser definidos com a quantia equivalente de argumentos ':exemplo'.

## Controladores

O servidor utiliza controladores para intermediar as requisições com o banco de dados. 

> O tratamento dos dados recebidos e enviados é feito pelos controladores.

### Usuários

**Conexão (Login) - '/controllers/users/login.js'**

```
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
```
> É responsável pela operação de login, recebe os parâmetros {email: (string), password: (string)} e então verifica se: são vazios, se o email está cadastro e compara com o hash armazenado no banco de dados. 

> Caso seja um sucesso retorna um web-token com as informações do login.

> Caso algo dê errado durante o processo, retorna um JSON explicando o erro.

**Verificação de Login - '/controllers/users/logged.js'**
```
    const wbtoken = require('jsonwebtoken');

    async function logged(req, res, next) {
        let Auth = req.cookies.Token || null;

        if(typeof(Auth) == 'undefined' || Auth === '' || Auth == null) {
            return res.redirect('/login');
        }
        else {
            try {
                Token = await wbtoken.verify(Auth, process.env.WBTOKEN_PASS);
                next();
            }
            catch (err) {
                return res.redirect('/login');
            }
        }
    }
```
> Realiza uma verificação de web-token para confirmar login.

> Em casos de não haver web-token, ou ser inválido, realiza um redirect para a tela de login.

> É requisitado pela função 'logged' logo após ao caminho da rota.
```
    server.get('/', logged, async (req, res) => {
            
        const courses = await axios.get('/api/courses/list').then(response => response.data);

        const user = await tokendata(req, res)

        res.render(public+"course_list.ejs", {
            title : "Cursos",
            list : courses,
            user : user
        })
    })
```

**Desconexão (Logout) - '/controllers/users/desconect.js'**

```
    async function desconect(res) {
        res.clearCookie('Token');
        res.redirect('/login');
    }
```

> Limpa o cookie 'token' armazenado e redireciona o usuário para a página de login '/login'.

### Cursos



## Schemas

