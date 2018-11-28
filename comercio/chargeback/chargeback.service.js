const ChargeBackModel = require('./chargeback.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");
const Gateway = require("../gateway/gateway.model");

async function createChargeback (transactionIDBody,res) {   
    var stLogTitle = "createChargeback - Service";
    try {        
        var transactionId = transactionIDBody.params.transactionId;
        if(transactionId == undefined){
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }    
        var purchaseFound = await ChargeBackModel.findPurchase(transactionId); 
        if(purchaseFound.error){
            return { message: messages.TRANSACTION_NOT_FOUND, codeMessage: "TRANSACTION_NOT_FOUND", error: true};
        }    
        if(purchaseFound.status == "Chargeback"){
            return { message: messages.TRANSACTION_WITH_CHARGEBACK, codeMessage: "TRANSACTION_WITH_CHARGEBACK", error: true};
        }
        purchaseFound.status = "Chargeback";
        purchaseFound.amountReturned = purchaseFound.amount;
        purchaseFound.dateReturned = await ReusableFunctions.getTodayDate();
        var purchaseUpdated = await ChargeBackModel.updatePurchase(purchaseFound,transactionId);
        if(purchaseUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }     
                                        
        info = {
            status : "Chargeback",
            transactionId : transactionId,  
            transaction_date : '',
            name: ''                      
        }

        let category = purchaseFound.product.category;
        let gateway = await Gateway.findOne({category:category});
        var authorization = res.getHeaders()["authorization"];
        var responseInfo = {
            transactionId: transactionId,
            message: messages.DEVOLUTION_DONE,  

        }        
        await superagent.post(config.tepagoya_url).send({provider: gateway.name, operation: "notify", params : info, made_by : config.provider_name}).set("authorization",authorization).end(function(err,resp1){
            console.log("Received post callback");
            if (err){              
                return res.status(500).json({error : err});
            }         
        });  
        return  {provider : transactionIDBody.made_by, operation: "chargeback", params : responseInfo, made_by : transactionIDBody.made_by };             
    } catch(error){
        console.log("Entered catch");
        console.log(stLogTitle,error);
    }
}



module.exports = {createChargeback}; 