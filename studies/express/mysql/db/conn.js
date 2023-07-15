const mysql = require('mysql')

//CRIANDO A CONEXÇÃO COM O BANCO DE DADOS - CREATING THE CONNECTION TO THE DATABASE

const conn = mysql.createPool({
    connectTimeout: 100000, // tempo de conexão
    connectionLimit: 10, // quantia de conexões permitidas
    host: 'localhost',
    user: 'root',
    password: 'xSql135$',
    database: 'nodejs'
})

module.exports = conn