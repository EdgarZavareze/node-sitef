import SiTef from './src';
import express from 'express'; 
import http from 'http';
import cors from 'cors';

const sitef = new SiTef('./example/shared/bin/libclisitef.so');
var configSiTef = {
    ip: process.env.SITEF_IP || '192.168.1.28',
    loja: process.env.SITEF_LOJA || '00000000',
    terminal: process.env.SITEF_TERMINAL || '00000000',
    reservado: process.env.SITEF_RESERVADO || '',
};
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 81;
http.createServer({
  }, app).listen(port);
var config = {
    serviceVersion: "1.0.0.0.a1",
    serviceStatus: 0,
    serviceState: 1,
    serviceMessage: "Sessao nao criada previamente.",
    sessionId: ''
}
//Serviços Gerais
app.get('/agente/clisitef/state', function(req, res) { res.json({serviceVersion: config['serviceVersion'], serviceStatus: config['serviceStatus'], serviceState: config['serviceState']});});
app.post('/agente/clisitef/getVersion', function(req, res) { res.json({serviceStatus: 1, serviceMessage: config['serviceMessage']});});
//Gerenciamento de Sessão
app.get('/agente/clisitef/session', function(req, res) { res.json({implementado: false});});
//Serviços para operações com PinPad
app.post('/agente/clisitef/pinpad/open', function(req, res) { res.json({implementado: false});});
app.post('/agente/clisitef/pinpad/close', function(req, res) { res.json({implementado: false});});
app.post('/agente/clisitef/pinpad/isPresent', function(req, res) { res.json({implementado: false});});
app.post('/agente/clisitef/pinpad/readYesNo', function(req, res) { res.json({implementado: false});});
app.post('/agente/clisitef/pinpad/setDisplayMessage', function(req, res) { res.json({implementado: false});});
//Serviços para execução de uma transação simples
app.post('/agente/clisitef/startTransaction', function(req, res) {
    //console.log("startTransaction");
    //console.log('toaki') 
    console.log('body', req.body);
    let q = req['body'];
    configSiTef = {
        ip: configSiTef['ip'],
        loja: q['storeId'],
        terminal: q['terminalId'],
        reservado: process.env.SITEF_RESERVADO || '',
        paramAdicionais: q['trnAdditionalParameters']
    };
    console.log(configSiTef);
    let rrr = sitef.configuraIntSiTefInterativoEx(configSiTef).then(response => {
        //console.log("then configuraIntSiTefInterativoEx");

        let chars = '0123456789abcdef'.split('');
        let uuid = [];
        let rnd = Math.random;
        let r;
        for (let i=0; i<7; i++) {
            r = 0 | rnd()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
        uuid = uuid.join('');
        config['sessionId'] = uuid;
        //console.log("sessionId", uuid);
        if (response !== 0) {
            console.log("Response != 0", response);
            req.send(response);
        } else {
            //console.log("Response == 0", response);
            let objFuncao = {
                funcao: q['functionId']*1,
                valor?: q['trnAmount'],
                cupomFiscal: q['taxInvoiceNumber'],
                dataFiscal: q['taxInvoiceDate'],
                horaFiscal: q['taxInvoiceTime'],
                operador: q['cashierOperator'],
                parametros?: q['trnInitParameters']
            }
            //console.log("iniciarFuncao", objFuncao);
            let rrr2 = sitef.iniciarFuncao(objFuncao).then(response2 => {
                //console.log("RESPONSE2 ", response2);
                res.json({
                    clisitefStatus: response2,
                    serviceStatus: 0,
                    sessionId: config['sessionId']
                });
            }).catch(response2 => {
                console.log("catch response2", response2);
                res.send(response2);
            });
            //console.log(rrr2);
        }
        
    }).catch(response => {
        console.log("XXXX", response);
        res.send(response);
    });
    //console.log("fim configuraIntSiTefInterativoEx");

    //&functionId=0&trnAmount=123.45&taxInvoiceNumber=1&taxInvoiceDate=20200709&taxInvoiceTime=011603&cashierOperator=&trnAdditionalParameters=1%3D11037845000178%3B2%3D05411490000132&trnInitParameters=
    
});
app.post('/agente/clisitef/continueTransaction', function(req, res) { 
    console.log('body', req.body);
    let q = req['body'];

    //sessionId=84c2ff4e&data=&continue=0
    //sessionId=84c2ff4e&data=&continue=-1
    let tefMessage = {
        comando: 0,
        tipoCampo: 0,
        tamMinimo: 0,
        tamMaximo: 0,
        buffer: q['data'],
        tamanhoBuffer: 0,
        continua: q['continue']*1,
    };
    //console.log(tefMessage);
    const continua = sitef.continuarFuncao(tefMessage).then(x => {
        console.log("continua", x);
        let retorno = {
            fieldMaxLength: x['tamMaximo'], 
            serviceStatus: config['serviceStatus'],
            clisitefStatus: x['retorno'], 
            data: x['buffer'], 
            commandId: x['comando'], 
            fieldId: x['tipoCampo'], 
            fieldMinLength: x['tamMinimo'], 
            sessionId: config['sessionId']
        }
        console.log("Retorno", retorno);
        res.json(retorno);
    }).catch(x => {
        console.log("ERRO catch", x);
        res.json({erro: x});
    })
});
app.post('/agente/clisitef/finishTransaction', function(req, res) { 
    //sessionId=84c2ff4e&data=&continue=0
    //sessionId=84c2ff4e&data=&continue=-1
    console.log('body', req.body);
    let q = req['body'];
    let finalizar = { 
        confirma: q['confirm']*1,
        cupomFiscal: q['taxInvoiceNumber'],
        dataFiscal: q['taxInvoiceDate'],
        horaFiscal: q['taxInvoiceTime'],
        parametros: '',
    }
    let finaliza = sitef.finalizarFuncao(finalizar).then(x => {
        res.json({
            clisitefStatus: 0,
            serviceStatus: 0
        });
    }).catch(x => {
        console.log("ERRO FINALIZA", x);
        res.json(x);
    })
    
});

console.log('Message RESTful API server started on: ' + port);