const express = require('express');
const routerCommerce = express.Router();
const ChargebackController = require('./chargeback.controller');

routerCommerce.post('/chargeback', async function (req, res){

    var objResp = await ChargebackController.createChargeback(req.body);        
    if(objResp.error){
        return res.status(400).send(objResp);
    }else{
        return res.status(201).send(objResp);
    }  

});
module.exports = routerCommerce;