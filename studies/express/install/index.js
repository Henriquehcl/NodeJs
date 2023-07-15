const { application } = require('express')
const express = require('express')
const path = require('path')
const app = express()
const port = 3000

//pasta users
const users = require('./users')

const basePath = path.join(__dirname, 'templates')

//ler requisição body
app.use(express.urlencoded({
    extended: true
}),
)
app.use(express.json())

//arquivos estáticos
app.use(express.static('public'))

//Importando o router da pasta users
app.use('/users', users)

app.get('/', (req, res) => {
    res.sendFile(`${basePath}/index.html`);
})
app.use(function(req, res, next){
    res.status(404).sendFile(`${basePath}/404.html`);
})
app.listen(port,() => {
    console.log(`Rodando na porta ${port}`)
})