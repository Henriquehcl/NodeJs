// Arquivo: routes/index.js
// Configuração das rotas da API
//const express = require('express');
const multer = require('multer');
const { Router } = require('express');
const ImportController = require('../controller/ImportController');
const BoletoController = require('../controller/BoletosController');

const upload = multer({ dest: 'uploads/' });//efinindo diretório onde será salvo o CSV
const router = Router();

router.post('/importar-csv', upload.single('csv'), ImportController.importarCSV);
router.get('/boletos', BoletoController.buscarBoletos);
router.get('/boletos/relatorio', BoletoController.gerarRelatorio2);
router.post('/pdf/upload', upload.single('pdf'), BoletoController.PDFUpload);

module.exports = router;
