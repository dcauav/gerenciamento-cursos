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
> Atenção: O servidor irá iniciar na URL 'http://localhost:3030';

> Observação: É possível alterar a porta da URL ao final do arquivo server.js na pasta raiz.