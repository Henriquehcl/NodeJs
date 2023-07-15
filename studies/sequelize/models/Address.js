const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Address = db.define('Address',{
    street:{
        type: DataTypes.STRING,
        required: true,
    },
    number:{
        type: DataTypes.STRING,
        required: true
    },
    city:{
        type: DataTypes.STRING,
        required: true
    }
});
//relationship user to address - relacionamento do usuário com endereço
User.hasMany(Address)
//relationship adrress to user - relacionamento endereço com o usuário
Address.belongsTo(User)

module.exports = Address