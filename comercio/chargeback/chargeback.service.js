const ChargeBackModel = require('./chargeback.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");

async function createChargeback (transactionIDBody) {   
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
        var info = {
            transactionId: transactionId,
            message: messages.DEVOLUTION_DONE
        }
        return  {provider : transactionIDBody.made_by, operation: "chargeback", params : info, made_by : config.provider_name };

    } catch(error){
        console.log(stLogTitle,error);
    }
}



module.exports = {createChargeback}; 