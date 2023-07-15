const mysql = require('mysql')
const { Sequelize} = require('sequelize')

const sequelize = new Sequelize('nodejs', 'root', 'xSql135$',{
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('conectado! ')
} catch (error) {

    console.log(`Não foi possível conectar ${error}`)
    
}

module.exports = sequelize