# Documentação - GRC Cursos

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



