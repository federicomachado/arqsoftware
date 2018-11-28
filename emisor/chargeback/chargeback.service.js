const ChargeBackModel = require('./chargeback.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
const ReusableFunctions = require("../utils/reusableFunctions.js");

const superagent = require("superagent");

async function createChargeback (transactionIDBody,res) {
    var stLogTitle = "createChargeback - Service";
    try {   
        if(transactionIDBody == undefined){
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }        
        var transactionId = transactionIDBody.transactionId;
        var transactionFound = await ChargeBackModel.findTransaction(transactionId);      
        if(transactionFound.error){
            return { message: messages.TRANSACTION_NOT_FOUND, codeMessage: "TRANSACTION_NOT_FOUND", error: true};
        }        
        var numDayTrans =  ReusableFunctions.calculateDaysTransaction(transactionFound.date);      
        if(parseInt(numDayTrans) >= 180){
            return { message: messages.CHARGEBACK_DAYS_EXCEEDED, codeMessage: "CHARGEBACK_DAYS_EXCEEDED", error: true};
        }  
        if(transactionFound.status == "Chargeback"){
            return { message: messages.TRANSACTION_WITH_CHARGEBACK, codeMessage: "TRANSACTION_WITH_CHARGEBACK", error: true};
        }
        var newTransaction = transactionFound;
        newTransaction.status = "Complete";
        newTransaction.amount = parseFloat(transactionFound.amount)*-1;
        newTransaction.contrastedTransaction = transactionId;
        newTransaction.date = await ReusableFunctions.getTodayDate();
        var transactionCreated= await ChargeBackModel.createTransaction(newTransaction); 
        if(transactionCreated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var idTransactionCreated = transactionCreated._id;
        transactionFound.status = "Chargeback";
        transactionFound.contrastedTransaction = idTransactionCreated;
        var originalTransUpdated = await ChargeBackModel.updateTransaction(transactionFound);
        if(originalTransUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }
        var ccFound = await ChargeBackModel.findCreditCard(transactionFound.creditCardAcNumber);
        if(ccFound.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var newValue = parseFloat(ccFound.currentAmount) + parseFloat(newTransaction.amount); //the new transaction amount is negative
        var respCCUpdated = await ChargeBackModel.updateCC(transactionFound.creditCardAcNumber,newValue);  
        if(respCCUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var info = {
            transactionId: transactionId,
            message: messages.CHARGEBACK_FIXED
        }      
        var authorization = res.getHeaders()["authorization"];
        await superagent.post(config.tepagoya_url).send({provider : transactionFound.origin, operation: "chargeback", params : info, made_by : config.provider_name }).set("authorization",authorization).end(function(err,resp){
            if (err){
                console.log("err emisor:"+err );
                console.log(resp.body);
                return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
            }
        }); 
        return { message: messages.CHARGEBACK_FIXED, codeMessage: "CHARGEBACK_FIXED", error: false}; 
        
    } catch(error){
        console.log(stLogTitle,error);
    }
}
module.exports = {createChargeback}; 