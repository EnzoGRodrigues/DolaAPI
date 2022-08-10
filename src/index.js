const { response } = require('express');
const express = require('express');

const app = express()

/*request é tudo aquilo que a gente recebe da requisição, 
response é aquilo que vamos retornar
*/
app.get("/", (request, response) => { 
    return response.json({message: "Hello World!"});
})

app.listen(3030);