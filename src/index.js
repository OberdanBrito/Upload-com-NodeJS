const Config = require('./config')
const express = require('express')
const cors = require('cors')
const mv = require("mv");
fs = require('fs');
const app = express()
const config = new Config()

app.use(cors())

/**
 * Informe ao express a rota a ser acessada para enviar os arquivos
 */
app.post('/upload',  (req, res) => {

    let formidable = require('formidable');
    let fs = require('fs');
    let form = new formidable.IncomingForm();

    /**
     * O Formidable é o pacote necessário para tratar as informações do arquivo recebido
     */
    form.parse(req,  (err, fields, files) => {

        /**
         * Obtem as informações dos campos que foram enviaddos junto com o arquivo
         */
        let clienteId = req.query.cliente
        let atendimentoId = req.query.atendimento
        let diretorio = `${config.Upload.store}/${clienteId}/atendimentos/${atendimentoId}`
        let arquivo, origem;

        /**
         * Pesquisa se o destino do arquivo já existe e caso contrário tenta criar
         */
        if (!fs.existsSync(diretorio))
            fs.mkdirSync(diretorio, {recursive: true});


        /**
         * Neste ponto identificamos o tipo de conteúdo que foi enviado
         * As opções são (Arquivo Fídico) ou (Blob um tipo de conteúdo em byte formatado)
         */
        if (files.file !== undefined) {

            arquivo = files.file.path.split('/')[2]
            origem  = files.file.path

        } else if (files.blob) {

            arquivo = files.blob.name
            origem  = files.blob.path

        }

        /**
         * E para finalizar o processo armazenamos os dados recebidos no caminho de destino
         */
        mv(origem, `${diretorio}/${arquivo}`,  (err) => {
            if (err) throw err;

            /**
             * Se tudo ficar certo, o sistema devolve o nome do arquivo e
             * a situação do processo
             */
            res.json({
                state: true,
                name: arquivo,
                extra: {
                    info: 'sucesso',
                    param: req.query
                }
            })
        });
    });
})

app.listen(config.Service.port,  () => {
    console.log(`Serviço de upload executando na porta: ${config.Service.port}`)
})