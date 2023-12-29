# Filmlist

## Descrição

Uma web application onde o usuário pode ver uma lista de filmes cadastrados por um usuário administrador, porem para o usuário comum conseguir dar uma nota nesses filmes ele precisa se cadastrar.

Feito com ReactJs (básico, create react app), Nodejs (utilizando Express) e SQLite no banco de dados

## Instalação

Para instalar o projeto clone o repositório e siga os seguintes passos:

### Backend

1. Vá ate a pasta chamada api: `cd api`
2. Use o gerenciador de pacotes para instalar as dependências, iremos usar yarn nesse passo a passo: `yarn install`
3. Rode o script de migrations para criar as tabelas de filmes e de usuarios no banco de dados, ele também ira gerar um usuário admin para voce acessar a plataforma, as informações do usuário como o nome do usuário que sera usado para logar e a senha são retornadas no terminal mas voce consegue acessar as mesmas no arquivo de `dbconfig.js` caso precise, o script de migrations é: `yarn run migrations`
4. Rode o servidor local usando o comando: `yarn run dev`
5. No projeto há um json chamado `collections-insominia.json` que é uma coleção das requests suportadas pela api
6. O servidor estará rodando no endereço `http://localhost:8000`

### Frontend

1. Vá ate a pasta chamada client: `cd client`
2. Use o gerenciador de pacotes para instalar as dependências, iremos usar yarn nesse passo a passo: `yarn install`
3. Rode a aplicação localmente usando o comando: `yarn run dev`
4. A aplicação estará rodando no endereço `http://localhost:3000`

## Considerações

1. O JWT está implementado no backend mas infelizmente há alguma inconsistência relacionada ao browser que não consegui resolver nesse tempo do desafio, há um comentário sobre isso no middleware chamado `validateToken` no arquivo `JWT.js` da pasta api
