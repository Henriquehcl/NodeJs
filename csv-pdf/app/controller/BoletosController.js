const path = require('path');
const fs = require('fs');
//const csv = require('csv-parser');
const BoletosRepository = require('../repository/BoletosRepositoty');
const BoletosService = require('../service/BoletosService');


class BoletosController {

  async gerarPDF(req, res) {

    try {
      const boletos = await Boleto.findAll();

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pageSize = pdfDoc.getPageSizes()[0];

      for (const boleto of boletos) {
        const page = pdfDoc.addPage([pageSize.getWidth(), pageSize.getHeight()]);
        const {
          width,
          height
        } = page.getSize();

        page.drawText(`Nome do Sacado: ${boleto.nome_sacado}`, {
          x: 50,
          y: height - 50,
          size: 12,
          font,
        });

        const pdfBytes = await pdfDoc.save();
        const fileName = `${boleto.id}.pdf`;
        fs.writeFileSync(`./pdfs/${fileName}`, pdfBytes);
      }

      res.status(200).json({
        message: 'Arquivos PDF gerados com sucesso!'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Ocorreu um erro ao gerar os arquivos PDF.'
      });
    }

  }

  async buscarBoletos(req, res) {
    try {
      // Obter os parâmetros de filtro da query string
      const nome = req.query.nome;
      const valorInicial = req.query.valor_inicial;
      const valorFinal = req.query.valor_final;
      const idLote = req.query.id_lote;

      // Definir uma cláusula de filtro vazia inicialmente
      const whereClause = {};

      // Adicionar filtro por nome_sacado, se o parâmetro "nome" estiver presente
      if (nome) {
        whereClause.nome_sacado = nome;
      }

      // Adicionar filtro por valor entre valorInicial e valorFinal, se ambos estiverem presentes
      if (valorInicial && valorFinal) {
        whereClause.valor = {
          [Sequelize.Op.between]: [valorInicial, valorFinal],
        };
      } else if (valorInicial) {
        // Adicionar filtro por valor maior ou igual a valorInicial, se apenas valorInicial estiver presente
        whereClause.valor = {
          [Sequelize.Op.gte]: valorInicial,
        };
      } else if (valorFinal) {
        // Adicionar filtro por valor menor ou igual a valorFinal, se apenas valorFinal estiver presente
        whereClause.valor = {
          [Sequelize.Op.lte]: valorFinal,
        };
      }

      // Adicionar filtro por id_lote, se o parâmetro "idLote" estiver presente
      if (idLote) {
        whereClause.id_lote = idLote;
      }

      // Realizar consulta ao banco de dados para buscar os boletos com base nos filtros
      const boletos = await BoletosRepository.filtroBuscarBoletos(whereClause); //await Boleto.findAll({ where: whereClause });

      // Retornar os boletos encontrados como resposta no formato JSON
      res.status(200).json(boletos);
    } catch (error) {
      // Tratar erros e retornar status de erro e mensagem correspondente
      console.error('Erro ao buscar boletos:', error);
      res.status(500).json({
        message: 'Erro ao buscar boletos'
      });
    }

  }

  /***
   * gerar um relatório em PDF dos boletos presentes no banco de dados.
   */
  async gerarRelatorio(req, res) {
    try {
      // Buscar todos os boletos no banco de dados
      const boletos = await BoletosRepository.todosBoletos(); //await Boleto.findAll();

      // Gerar o relatório em PDF com base nos boletos
      const relatorio = await BoletosService.criarRelatorioPDF(boletos) //criarRelatorioPDF(boletos);

      // Ler o arquivo do relatório em formato base64
      const base64 = await fs.promises.readFile(relatorio, 'base64');

      res.status(200).json({
        base64
      });

    } catch (error) {
      console.error('Erro ao gerar relatório de boletos:', error);
      res.status(500).json({
        message: 'Erro ao gerar relatório de boletos'
      });
    }
  }
  async gerarRelatorio2(req, res) {
    try {

      // Verificar se o parâmetro relatorio=1 foi fornecido
      const {
        relatorio
      } = req.query;

      if (relatorio) {
        const boletoId = await BoletosRepository.buscarBoletoPorId(1)

        // Gerar o relatório em PDF com base nos boletos
        //const pdfBytes = await BoletosService.criarRelatorioPDF2(relatorio);
        const relatorio = await BoletosService.criarRelatorioPDF(boletoId)

        const base64 = await fs.promises.readFile(relatorio, 'base64');
        res.status(200).json({
          base64
        });

      } else {

        // Buscar todos os boletos no banco de dados
        const boletos = await BoletosRepository.todosBoletos();

        // Gerar o relatório em PDF com base nos boletos
        const relatorio = await BoletosService.criarRelatorioPDF(boletos)

        // Ler o arquivo do relatório em formato base64
        const base64 = await fs.promises.readFile(relatorio, 'base64');

        res.status(200).json({
          base64
        });

      }
    } catch (error) {
      console.error('Erro ao gerar relatório de boletos:', error);
      res.status(500).json({
        message: 'Erro ao gerar relatório de boletos'
      });
    }
  }

  async PDFUpload(req, res) {
    try {
      const file = req.file;
      const outputDir = 'uploads/pdf'; // Diretório de saída onde os arquivos PDF individuais serão salvos

      // Verifica se o diretório de saída existe, se não existir, crie-o
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {
          recursive: true
        });
      }

      // Divide o PDF em páginas individuais
      await BoletosService.splitPDFPages(file.path, outputDir);

      res.status(200).json({
        message: 'PDF dividido em arquivos individuais com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao dividir o PDF:', error);
      res.status(500).json({
        message: 'Erro ao dividir o PDF'
      });
    }
  }

}

module.exports = new BoletosController();