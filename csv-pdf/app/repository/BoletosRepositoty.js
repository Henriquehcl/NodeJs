const conn = require('../database/connection');
const Boletos = require('../model/Boletos');

class BoletosRepository {

    async salvarBoletosCSV(boletos){
        console.log('dentro do repository de boletos')
        console.log(boletos);

        try {
            if(boletos){
                return await Boletos.create(boletos);
            }
            return false;
        } catch (error) {
            console.error(error)
            return false;
        }   
    }

    async filtroBuscarBoletos(query) {
        try {
            if (query) {
                const boletos = await Boletos.findAll({ where: query });
                if (boletos) {
                    return boletos;
                }
                return false;
            }
            return false;
            
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    async buscarBoletoPorId(idBoleto) {

        try {
          const boleto = await Boletos.findOne({where:{id:idBoleto},raw:true});
          if (boleto) {
            return [boleto]; // Retorna um array com o boleto encontrado
          } else {
            return []; // Retorna um array vazio se o boleto não for encontrado
          }
        } catch (error) {
          console.error('Erro ao buscar boleto por ID:', error);
          return false;
        }
      }

    async todosBoletos() {
        try {
            const boletos = await Boletos.findAll();
            if (boletos) {
                return boletos;
            }
            return false;
        } catch (error) {
            console.error(error)
            return false;
        }
    }


}

module.exports = new BoletosRepository();