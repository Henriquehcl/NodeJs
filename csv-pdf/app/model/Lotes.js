const { DataTypes, Model } = require('sequelize');
const conn = require('../database/connection');

class Lotes extends Model {}

    Lotes.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
      },
      {
        sequelize: conn,
        modelName: 'Lotes',
        tableName: 'lotes',
        timestamps: true,
        createdAt: 'criado_em',
        updatedAt: 'atualizado_em',
        underscored: true
      }
    );


module.exports = Lotes;
