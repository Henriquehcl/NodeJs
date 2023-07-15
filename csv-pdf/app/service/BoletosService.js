const PdfPrinter = require("pdfmake");
const path = require("path");
//const BoletosRepository = require('../repository/BoletosRepositoty')
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

class BoletosService {

  async criarRelatorioPDF(boletos) {
    try {
      //const fs = require("fs");

      //const PdfPrinter = require("pdfmake");

      // Definir o caminho da fonte que será usada
      const fontPath = path.join(__dirname, "../../fonts/ARIAL.TTF");

      // Ler a fonte como buffer
      const fontBuffer = fs.readFileSync(fontPath);

      // Configurar a fonte Arial
      const fonteArial = {
        normal: fontBuffer,
        bold: fontBuffer,
        italics: fontBuffer,
        bolditalics: fontBuffer,
      };

      // Definir as configurações do documento PDF
      const docDefinition = {
        content: [{
            text: "Relatório de Boletos",
            fontSize: 14,
            alignment: "center",
          },
          {
            style: "tabela",
            table: {
              headerRows: 1,
              widths: ["auto", "auto", "auto", "auto", "auto"],
              body: [
                ["ID", "Nome Sacado", "ID Lote", "Valor", "Linha Digitável"],
                ...boletos.map((boleto) => [
                  boleto.id,
                  boleto.nome_sacado,
                  boleto.id_lote,
                  boleto.valor,
                  boleto.linha_digitavel,
                ]),
              ],
            },
            layout: {
              fillColor: function (rowIndex, node, columnIndex) {
                return rowIndex % 2 === 0 ? "#CCCCCC" : null;
              },
            },
          },
        ],
        styles: {
          tabela: {
            margin: [0, 10, 0, 10],
          },
        },
      };

      // Criar o documento PDF
      const printer = new PdfPrinter({
        Roboto: fonteArial
      });
      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      // Obter a data atual
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear();
      const mesAtual = dataAtual.getMonth() + 1; // Os meses são indexados a partir de 0

      // Criar o caminho da pasta relatóriosPDF com base no ano e mês atual
      const pastaRelatoriosPDF = path.join(`../../relatoriosPDF/${anoAtual}-${mesAtual}`);

      // Verificar se a pasta existe
      //verificar se tem permissão para criar diretórios, caso não tenha, gerará um erro
      if (!fs.existsSync(pastaRelatoriosPDF)) {
        // Criar a pasta se ela não existir
        fs.mkdirSync(pastaRelatoriosPDF, {
          recursive: true
        });
      }

      /*
      fs.access(pastaRelatoriosPDF, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
          console.error('Você não tem permissão para acessar o diretório:', pastaRelatoriosPDF);
        } else {
          console.log('Você tem permissão para acessar o diretório:', pastaRelatoriosPDF);
        }
      });*/

      // Definir o nome do arquivo com base na data/hora atual
      const dataHoraAtual = dataAtual.toISOString().replace(/[:.]/g, "-");
      const nomeArquivo = `relatorio-${dataHoraAtual}.pdf`;
      //const caminhoRelatorio = path.join(pastaRelatoriosPDF, nomeArquivo);
      const caminhoRelatorio = path.join(__dirname, pastaRelatoriosPDF, nomeArquivo); //"relatoriosPDF/2023-7/relatorio-1.pdf");


      // salva o documento PDF para o arquivo no sistema de arquivos
      const writeStream = fs.createWriteStream(caminhoRelatorio);
      //fs.chmodSync(caminhoRelatorio, '777');
      pdfDoc.pipe(writeStream);
      pdfDoc.end();

      // Esperar a conclusão da escrita do arquivo antes de prosseguir
      await new Promise((resolve, reject) => {
        writeStream.on("finish", resolve);
        writeStream.on("error", reject);
      });
      // Verificar se o arquivo foi criado corretamente
      if (fs.existsSync(caminhoRelatorio)) {

        return caminhoRelatorio;
      } else {
        return false;
      }

    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async splitPDFPages(inputFilePath, outputDir) {

    const pdfBytes = await fs.promises.readFile(inputFilePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    const numPages = pdfDoc.getPageCount();
  
    for (let i = 0; i < numPages; i++) {
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);
  
      const outputPath = `${outputDir}/${i + 1}.pdf`;
      const pdfBytes = await newPdf.save();
  
      await fs.promises.writeFile(outputPath, pdfBytes);
    }
  }
}

module.exports = new BoletosService();