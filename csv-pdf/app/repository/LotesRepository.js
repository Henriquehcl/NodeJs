const conn = require('../database/connection');
const Lotes = require('../model/Lotes')

class BoletosRepository {

    async todosLotes(){
        try {
            return await Lotes.findAll();
        } catch (error) {
            console.error(error)
            return false;
        }
    }

    async encontrarUmLote(unidade){
        try {
            const lote = await Lotes.findOne({ where: { nome: unidade } });
            if (lote){
                return lote;
            }
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

}

module.exports = new BoletosRepository();