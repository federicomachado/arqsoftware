const ChargeBackModel = require('./chargeback.model');
const messages = require("../messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");

async function createChargeback (transactionIDBody) {   
    var stLogTitle = "createChargeback - Service";
    try {   
        var transactionId = transactionIDBody.transactionId;
        if(transactionId == undefined){
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }    
        var purchaseFound = await ChargeBackModel.findPurchase(transactionId); 
        console.log("purchaseFound: "+JSON.stringify(purchaseFound));
        if(purchaseFound.error){
            return { message: messages.TRANSACTION_NOT_FOUND, codeMessage: "TRANSACTION_NOT_FOUND", error: true};
        }    
        if(purchaseFound.status == "Chargeback"){
            return { message: messages.TRANSACTION_WITH_CHARGEBACK, codeMessage: "TRANSACTION_WITH_CHARGEBACK", error: true};
        }
        purchaseFound.status = "Chargeback";
        purchaseFound.amountReturned = purchaseFound.amount;
        purchaseFound.dateReturned = await getTodayDate();
        var purchaseUpdated = await ChargeBackModel.updatePurchase(purchaseFound);
        if(purchaseUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }     
        var info = {
            transactionId: transactionId,
            message: messages.DEVOLUTION_DONE
        } 

        return  {provider : transactionIDBody.made_by, operation: "devolution", params : info, made_by : config.provider_name };

    } catch(error){
        console.log(stLogTitle,error);
    }
}

async function getTodayDate() {
    var stLogTitle = "getTodayDate";
    try {
        var todayDate = new Date();
        return moment(todayDate, config.default_expires_format).toDate();
    } catch (error) {
        console.log(stLogTitle, error);
    }
}

module.exports = {createChargeback}; 