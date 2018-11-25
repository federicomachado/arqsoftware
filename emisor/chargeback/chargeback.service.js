const ChargeBackModel = require('./chargeback.model');
const messages = require("../messages.json");
const config = require("../config.json");


async function createChargeback (transactionIDBody) {
    var stLogTitle = "createChargeback - Service";
    try {
        var transactionId = transactionIDBody.transactionId;
        var transactionFound = await ChargeBackModel.findTransaction(transactionId); 
        if(transactionFound.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var newTransaction = transactionFound;
        newTransaction.status = "Chargeback";
        newTransaction.amount = parseFloat(transactionFound.transaction.amount)*-1;
        console.log(transactionFound.transaction.creditCardAcNumber);
        var respCCUpdated = await ChargeBackModel.updateCC(transactionFound.transaction.creditCardAcNumber);  
        return true;  

    } catch(error){
        console.log(stLogTitle,error);
    }
}

module.exports = {createChargeback}; 