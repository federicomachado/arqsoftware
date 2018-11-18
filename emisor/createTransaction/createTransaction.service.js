const TransactionModel = require('./createTransaction.model');
const MESSAGE_TO_SEND = require('../messageManagement');
var luhn = require("luhn");

var moment = require("moment");
async function createTransaction(bodyAnswer){
    var stLogTitle = "createTransaction - Service";
    try{
        // if(!luhn.validate(bodyAnswer.creditCard.numberCreditCard)){
        // console.log("no cumple con algoritomo de Luhn");
        //}  
        var creditCardFound = await TransactionModel.findCreditCard(bodyAnswer);
        if(creditCardFound != null && creditCardFound!= "" && Object.keys(creditCardFound).length != 0){         
            var dateToValidate = new Date(bodyAnswer.creditCard.expires);
            var expireDate = new Date(creditCardFound.expires);
            var todayDate = new Date(); 
            if(todayDate > expireDate){
                return MESSAGE_TO_SEND["EXPIRED_CARD"];          
            }
            if(parseFloat(creditCardFound.currentAmount) < parseFloat(bodyAnswer.transaction.amount)){  
                return MESSAGE_TO_SEND["INSUFFICIENT_AMOUNT"];         
            }
            if(creditCardFound.blockedState.isBlocked){
                return MESSAGE_TO_SEND["CREDITCARD_BLOCKED"]; 
            }    

            var newTransaction = bodyAnswer.transaction;
            newTransaction.date = new Date();
            newTransaction.status = "Complete";
            creditCardFound.transactions.push(newTransaction);

            var respModel = await TransactionModel.createTransaction(creditCardFound);   
            if(respModel.error){
                MESSAGE_TO_SEND["DATABASE_ERROR"].errorDetail = respModel.errorDetail;        
                return MESSAGE_TO_SEND["DATABASE_ERROR"];
            }else{          
                return MESSAGE_TO_SEND["TRANSACTION_CREATED"];
            }
        }

    }catch(error){
        console.log(stLogTitle,error);
    }
}
module.exports = {createTransaction}; 