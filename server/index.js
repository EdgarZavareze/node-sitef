const SiTef = require('node-sitef');
const configSiTef = require('../shared/config/index.ts');

var express = require('express'),
app = express(),
port = process.env.PORT || 3000;
app.listen(port);
var config = {
    serviceVersion: "1.0.0.0.a1",
    serviceStatus: 0,
    serviceState: 1,
    serviceMessage: "Sessao nao criada previamente."
}
//Serviços Gerais
app.get('/agente/clisitef/state', function(req, res) { res.json({serviceVersion: config['serviceVersion'], serviceStatus: config['serviceStatus'], serviceState: config['serviceState']});});
app.get('/agente/clisitef/getVersion', function(req, res) { res.json({serviceStatus: 1, serviceMessage: config['serviceMessage']});});
//Gerenciamento de Sessão
app.get('/agente/clisitef/session', function(req, res) { res.json({implementado: false});});
//Serviços para operações com PinPad
app.get('/agente/clisitef/pinpad/open', function(req, res) { res.json({implementado: false});});
app.get('/agente/clisitef/pinpad/close', function(req, res) { res.json({implementado: false});});
app.get('/agente/clisitef/pinpad/isPresent', function(req, res) { res.json({implementado: false});});
app.get('/agente/clisitef/pinpad/readYesNo', function(req, res) { res.json({implementado: false});});
app.get('/agente/clisitef/pinpad/setDisplayMessage', function(req, res) { res.json({implementado: false});});
//Serviços para execução de uma transação simples
app.get('/agente/clisitef/startTransaction', function(req, res) { 
    //sitefIp=127.0.0.1&storeId=00000000&terminalId=REST0001&functionId=0&trnAmount=123.45&taxInvoiceNumber=1&taxInvoiceDate=20200709&taxInvoiceTime=011603&cashierOperator=&trnAdditionalParameters=1%3D11037845000178%3B2%3D05411490000132&trnInitParameters=
    res.json({clisitefStatus: 10000,
        serviceStatus: 0,
        sessionId: "dee85a3"});
});
app.get('/agente/clisitef/continueTransaction', function(req, res) { 
    //sessionId=84c2ff4e&data=&continue=0
    //sessionId=84c2ff4e&data=&continue=-1
    res.json({
        fieldMaxLength: 0, 
        serviceStatus: 0,
        clisitefStatus: 10000, 
        data: "Conectando Servidor", 
        commandId: 1, 
        fieldId: -1, 
        fieldMinLength: 0, 
        sessionId: "dee85a3"
    });
});
app.get('/agente/clisitef/continueTransaction', function(req, res) { 
    //sessionId=84c2ff4e&data=&continue=0
    //sessionId=84c2ff4e&data=&continue=-1
    res.json({
        fieldMaxLength: 0, 
        serviceStatus: 0,
        clisitefStatus: 10000, 
        data: "Conectando Servidor", 
        commandId: 1, 
        fieldId: -1, 
        fieldMinLength: 0, 
        sessionId: "dee85a3"
    });
});

console.log('Message RESTful API server started on: ' + port);