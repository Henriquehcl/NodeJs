const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');
const BoletosRepository = require('../repository/BoletosRepositoty');
const LotesRepository = require('../repository/LotesRepository');
const Boletos = require('../model/Boletos');



class ImportController {

  async importarCSV(req, res) {
    try {
      const file = req.file;
      console.log(file)
      const csvData = fs.readFileSync(file.path, 'utf-8');
      const rows = csvData.split('\n');
  
      const mapeamento = {
        '17': 3,
        '18': 6,
        '19': 7,
        // Adicione outros mapeamentos necessários
      };
  
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(';');
        const nomeSacado = rowData[0];
        const nomeUnidade = rowData[1];
        const valor = parseFloat(rowData[2]);
        const linhaDigitavel = rowData[3];
  
        const idLote = mapeamento[nomeUnidade];
        if (idLote) {

          await BoletosRepository.salvarBoletosCSV({
            nome_sacado: nomeSacado,
            id_lote: idLote,
            valor: valor,
            linha_digitavel: linhaDigitavel,
          });

        } else {
          console.log(`Lote não encontrado para a unidade: ${nomeUnidade}`);
        }
      }
  
      res.status(200).send('Importação concluída com sucesso!');
    } catch (error) {
      console.error('Erro na importação do CSV:', error);
      res.status(500).send('Erro na importação do CSV');
    }

  }
}

module.exports = new ImportController();
