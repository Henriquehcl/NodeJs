require('dotenv').config();
const express = require('express');
const conn = require('./app/database/connection');
const Lotes = require('./app/model/Lotes');
//const multer = require('multer');
//const fs = require('fs');

(async () => {

    try {

        const routes = require('./app/routes/index')

        const app = express();

        app.use(express.json()); //bodyParser

        app.use('/', routes);

        await conn.sync({
            force: false
        }); // Sincroniza o modelo com o banco de dados
        console.log(`Running database ${process.env.DATABASE_NAME} on port ${process.env.DATABASE_PORT}`)

        conn.sync().then(async () => {
            // Adicionar os dados de unidades na tabela "lotes"
            const unidades = [
              { nome: '17', ativo: true },
              { nome: '18', ativo: true },
              { nome: '19', ativo: true },
              // Adicione outras unidades necessárias
            ];
          
            try {
              await Lotes.bulkCreate(unidades);
              console.log('Dados de unidades adicionados com sucesso!');
            } catch (error) {
              console.error('Erro ao adicionar dados de unidades:', error);
            }
          

            });

        await app.listen(process.env.PORT)
        console.log('Express server listening on port %s', process.env.PORT);



    } catch (error) {
        console.error(error)
    }

})();