const TransactionModel = require('./createTransaction.model');
const MESSAGE_TO_SEND = require('../messageManagement');
var luhn = require("luhn");

var moment = require("moment");
async function createTransaction(bodyAnswer){
    var stLogTitle = "createTransaction - Service";
    try{
        if(!luhn.validate(bodyAnswer.number)){
            return MESSAGE_TO_SEND["DONOT_MET_LUNH_ALGORITHM"]; 
        }    
        var creditCardFound = await TransactionModel.findCreditCard(bodyAnswer);
        if(creditCardFound != null && creditCardFound!= "" && Object.keys(creditCardFound).length != 0){
            var securityCode = creditCardFound.security_code;
            if(parseInt(securityCode) != parseInt(bodyAnswer.security_code)){
                return MESSAGE_TO_SEND["INCORRECT_SECURITY_CODE"];
            }
            if(bodyAnswer.expires == undefined){
                return MESSAGE_TO_SEND["ENTER_EXPIRED_DATE"];
            }                        
            var dateToValidate = moment(bodyAnswer.expires,"YYYY-MM-DD").toDate();
            var expireDate = moment(creditCardFound.expires,"YYYY-MM-DD").toDate();                     
            if(!(dateToValidate.getTime() == expireDate.getTime()) ){           
                return MESSAGE_TO_SEND["INCORRECT_EXPIRED_DATE"];
            }           
            var todayDate = new Date(); 
            todayDate =  moment(todayDate,"YYYY-MM-DD").toDate();
            if(todayDate.getTime() > expireDate.getTime()){
                return MESSAGE_TO_SEND["EXPIRED_CARD"];          
            }        
            if(bodyAnswer.transaction_amount == null || parseFloat(bodyAnswer.transaction_amount) <= 0){
                return MESSAGE_TO_SEND["INCORRECT_AMOUNT"];
            }
            if(bodyAnswer.transaction_origin == null || bodyAnswer.transaction_origin == "" || bodyAnswer.transaction_origin == undefined){
                return MESSAGE_TO_SEND["ORIGIN_NEEDED"];
            }        
            if(bodyAnswer.transaction_detail == null || bodyAnswer.transaction_detail== "" || bodyAnswer.transaction_detail == undefined){
                return MESSAGE_TO_SEND["DETAIL_NEEDED"];
            }
            /*
            if(parseFloat(creditCardFound.currentAmount) < parseFloat(bodyAnswer.transaction.amount)){  
                return MESSAGE_TO_SEND["INSUFFICIENT_AMOUNT"];         
            }
            */
            if(creditCardFound.blockedState.isBlocked){
                return MESSAGE_TO_SEND["CREDITCARD_BLOCKED"]; 
            }
            if(creditCardFound.denouncedState.isDenounced){
                return MESSAGE_TO_SEND["CREDIT_CARD_DENOUNCED"]; 
            }
            var newAmount = parseFloat(creditCardFound.currentAmount) + parseFloat(bodyAnswer.transaction_amount);
            if(parseFloat(newAmount) > parseFloat(creditCardFound.limitAmount)){
                return MESSAGE_TO_SEND["CREDIT_CARD_EXCEED_LIMIT"]; 
            }
            //Save transaction
            var newTransaction = {}; 
            newTransaction.amount = bodyAnswer.transaction_amount;  
            newTransaction.origin = bodyAnswer.transaction_origin;
            newTransaction.detail = bodyAnswer.transaction_detail;
            newTransaction.date = todayDate;
            newTransaction.status = "Complete";
            creditCardFound.currentAmount = newAmount;
            creditCardFound.transactions.push(newTransaction);
            var respModel = await TransactionModel.createTransaction(creditCardFound);               
            if(respModel.error){
                MESSAGE_TO_SEND["DATABASE_ERROR"].errorDetail = respModel.errorDetail;        
                return MESSAGE_TO_SEND["DATABASE_ERROR"];
            }else{  
                MESSAGE_TO_SEND["TRANSACTION_CREATED"].transactionID = respModel.transactionID;           
                return MESSAGE_TO_SEND["TRANSACTION_CREATED"];
            }
        }else{
            return MESSAGE_TO_SEND["CREDITCARD_DONOT_BELONG_EMISOR"];
        }
    }catch(error){
        console.log(stLogTitle,error);
        MESSAGE_TO_SEND["CONEXION_ERROR"].errorDetail = error;   
        return MESSAGE_TO_SEND["CONEXION_ERROR"];
    }
}
module.exports = {createTransaction}; 