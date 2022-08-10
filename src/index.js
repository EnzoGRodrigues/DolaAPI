const { response } = require('express');
const express = require('express');
const { v4: uuidv4} = require("uuid");

const app = express()

app.use(express.json());


const customers = [];
/*request é tudo aquilo que a gente recebe da requisição, 
response é aquilo que vamos retornar
*/

/*
    GET - Buscar uma informação dentro do servidor
    POST - Inserir uma informação no servidor
    PUT - Alterar uma informação no servidor
    PATCH - Alterar uma informação específica
    DELETE - Deletar uma informação no servidor
*/

/*
    Tipos de parâmetros

    Route Params => Servem para identificar um recurso, editar, deletar ou buscar
    Query Params => Servem para paginação, filtro.
    Body Params => Os objetos que passaremos para inserção e/ou alteração
*/

/*
    cpf - string
    name - string
    id - uuid universally unique identifier 
    statement []
*/

app.post("/account", (request, response) =>{
    const {cpf, name} = request.body;
    const id = uuidv4();
    customers.push({
        cpf,
        name,
        id,
        statement: []
    });
    return response.status(201).send();
});

app.listen(3030);