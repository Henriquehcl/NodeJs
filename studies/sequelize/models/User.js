const { DataTypes } = require('sequelize')

const db = require('../db/conn')

const User = db.define('User', {
    name:{
        type: DataTypes.STRING,
        required: false,
    },
    occupation:{
        type: DataTypes.STRING,
        required: false,
    },
    newsletter:{
        type: DataTypes.BOOLEAN
    }
})

module.exports = User