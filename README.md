# Taqtile Bot

Este projeto contém um CRUD feito com graphql e typescript.

## Antes de iniciar

Antes de tentar executar o projeto, tenha em sua máquina as seguintes ferramentas:

- [nodejs](https://nodejs.org/pt)
- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/install/)

## Como executar o projeto

Primeiro vamos colocar iniciar o banco de dados com o comando

```bash
docker compose up -d
```

Após isso vamos instalar as dependências do projeto

```bash
npm install
```

E então vamos iniciar a aplicação

```bash
npm run dev
```

## Tecnologias utilizadas no desenvolvimento

- Nodejs
- Graphql
- Apollo server
- PrismaORM
- PostgreSQL
- TypeScript
