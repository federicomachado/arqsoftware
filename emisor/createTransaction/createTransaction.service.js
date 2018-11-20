const TransactionModel = require('./createTransaction.model');
const MESSAGE_TO_SEND = require('../messageManagement');
const messages = require("../messages.json");
var luhn = require("luhn");

var moment = require("moment");
async function createTransaction(bodyAnswer){
    var stLogTitle = "createTransaction - Service";
    try{
        if(!luhn.validate(bodyAnswer.number)){
            return {message: messages.DONOT_MET_LUNH_ALGORITHM, codeMessage:"DONOT_MET_LUNH_ALGORITHM",error:true}; 
        }    
        var creditCardFound = await TransactionModel.findCreditCard(bodyAnswer);
        if(creditCardFound != null && creditCardFound!= "" && Object.keys(creditCardFound).length != 0){
            var securityCode = creditCardFound.security_code;
            if(parseInt(securityCode) != parseInt(bodyAnswer.security_code)){
                return {message: messages.INCORRECT_SECURITY_CODE, codeMessage:"INCORRECT_SECURITY_CODE" ,error:true}                
            }
            if(bodyAnswer.expires == undefined){
                return {message: messages.ENTER_EXPIRED_DATE, codeMessage:"ENTER_EXPIRED_DATE" ,error:true}                                
            }                        
            var dateToValidate = moment(bodyAnswer.expires,"YYYY-MM-DD").toDate();
            var expireDate = moment(creditCardFound.expires,"YYYY-MM-DD").toDate();                     
            if(!(dateToValidate.getTime() == expireDate.getTime()) ){           
                return {message: messages.INCORRECT_EXPIRED_DATE, codeMessage:"INCORRECT_EXPIRED_DATE" ,error:true}                                                
            }           
            var todayDate = new Date(); 
            todayDate =  moment(todayDate,"YYYY-MM-DD").toDate();
            if(todayDate.getTime() > expireDate.getTime()){
                return {message: messages.EXPIRED_CARD, codeMessage:"EXPIRED_CARD" ,error:true}                                                  
            }        
            if(bodyAnswer.transaction_amount == null || parseFloat(bodyAnswer.transaction_amount) <= 0){
                return {message: messages.INCORRECT_AMOUNT, codeMessage:"INCORRECT_AMOUNT" ,error:true}                                                
            }
            if(bodyAnswer.transaction_origin == null || bodyAnswer.transaction_origin == "" || bodyAnswer.transaction_origin == undefined){
                return {message: messages.ORIGIN_NEEDED, codeMessage:"ORIGIN_NEEDED" ,error:true}                                                                
            }        
            if(bodyAnswer.transaction_detail == null || bodyAnswer.transaction_detail== "" || bodyAnswer.transaction_detail == undefined){
                return {message: messages.DETAIL_NEEDED, codeMessage:"DETAIL_NEEDED" ,error:true}                                                                                
            }
            /*
            if(parseFloat(creditCardFound.currentAmount) < parseFloat(bodyAnswer.transaction.amount)){  
                return MESSAGE_TO_SEND["INSUFFICIENT_AMOUNT"];         
            }
            */
            if(creditCardFound.blockedState.isBlocked){
                return {message: messages.CREDITCARD_BLOCKED, codeMessage:"CREDITCARD_BLOCKED" ,error:true}                                                                                              
            }
            if(creditCardFound.denouncedState.isDenounced){
                return {message: messages.CREDIT_CARD_DENOUNCED, codeMessage:"CREDIT_CARD_DENOUNCED" ,error:true}                                                                                                
            }
            var newAmount = parseFloat(creditCardFound.currentAmount) + parseFloat(bodyAnswer.transaction_amount);
            if(parseFloat(newAmount) > parseFloat(creditCardFound.limitAmount)){
                return {message: messages.CREDIT_CARD_EXCEED_LIMIT, codeMessage:"CREDIT_CARD_EXCEED_LIMIT" ,error:true}                                                                                                                
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
                return {message: messages.DATABASE_ERROR, codeMessage:"DATABASE_ERROR" ,error:true, errorDetail : respModel.errorDetail}                                                                                                                                                
            }else{                  
                return {message: messages.TRANSACTION_CREATED, codeMessage:"TRANSACTION_CREATED" ,error:false, transactionID : respModel.transactionID}                                                                                                                                                                
            }
        }else{
            return {message: messages.CREDITCARD_DONOT_BELONG_EMISOR, codeMessage:"CREDITCARD_DONOT_BELONG_EMISOR" ,error:true} 
        }
    }catch(error){
        console.log(stLogTitle,error);        
        return {message: messages.CONEXION_ERROR, codeMessage:"CONEXION_ERROR" ,error:true, errorDetail : error}                                                                                                                                                        
    }
}
module.exports = {createTransaction}; 