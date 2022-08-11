const { response, request } = require('express');
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
/*
middleware são requisições que ficam entre o request e o response
usamos para fazer a validação de um token, ou para verificar se
aquele usuário é mesmo um admin ou não.
*/

function verifyIfExistsAccountCPF(request, response, next){ //função de middleware
    const {cpf} = request.headers; //usando route params, pq atraves do cpf a pesquisa será feita
    const customer = customers.find((customer)=> customer.cpf === cpf); //usado para encontrar o cpf existente
    if (!customer){
        return response.status(400).json({error: "Customer not found"});
    }

    request.customer = customer;

    return next();
}

function getBalance(statement){
    const balance = statement.reduce((acc, operation)=>{
        if (operation.type ==='credit'){
            return acc + operation.amount;
        }else{
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}
app.post("/account", (request, response) =>{//usando o post para inserir informações da conta 
    const {cpf, name} = request.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if(customerAlreadyExists){
        return response.status(400).json({error: "Customer already exists!"});
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });
    return response.status(201).send();
});
 
//app.use(verifyIfExistsAccountCPF); posso  usar essa  maneira se eu  qusier que todas as rotas abaixo tenham um middleware

app.get("/statement", verifyIfExistsAccountCPF, (request,  response) =>{ //usando o get   para procurar o extrato bancário 
    const {customer}=request;
     return response.json(customer.statement); //retorno desse cpf será o statement, que é o extrato
});

app.post("/deposit", verifyIfExistsAccountCPF, (request, response)=>{
    const {description, amount} = request.body;
    const {customer}= request;

    const statementOperation = {
        description,
        amount,
        created_at:new Date(),
        type: "credit", 
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.post("/withdraw", verifyIfExistsAccountCPF, (request, response)=>{
    const {amount} = request.body;
    const {customer} = request;
    const balance = getBalance(customer.statement);

    if (balance < amount){
        return response.status(400).json({error: "Insufficient funds!"})
    }

    const statementOperation={
        amount,
        created_at:new Date(),
        type: "debit", 
    };

    customer.statement.push(statementOperation);

    return response.status(201).send();
});

app.get("/statement/date", verifyIfExistsAccountCPF, (request,  response) =>{ //usando o get   para procurar o extrato bancário 
    const {customer} = request;
    const {date} = request.query;

    const dateFormat = new Date(date + " 00.00");

    const statement = customer.statement.filter(
        (statement)=> statement.created_at.toDateString() ===
        new Date(dateFormat).toDateString());
     
    return response.json(statement); //retorno desse cpf será o statement, que é o extrato
});

app.listen(3030);