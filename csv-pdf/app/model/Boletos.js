const { DataTypes, Model } = require('sequelize');
const conn = require('../database/connection');
const Lotes = require('./Lotes')

class Boletos extends Model {}

    Boletos.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome_sacado: {
            type: DataTypes.STRING,
            allowNull: true
        },
        id_lote:{
            type: DataTypes.INTEGER,
            allowNull:false
        },
        valor: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true
        },
        linha_digitavel: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
      },
      {
        sequelize: conn,
        modelName: 'Boletos',
        tableName: 'boletos',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
        underscored: true
      }
    );


module.exports = Boletos;
