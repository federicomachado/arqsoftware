const TransactionModel = require('./createTransaction.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
var luhn = require("luhn");
var moment = require("moment");
const ReusableFunctions = require("../utils/reusableFunctions.js");

async function createTransaction(purchaseToValidate) {
    var stLogTitle = "createTransaction - Service";
    try {
        body = purchaseToValidate;  
        purchaseToValidate = purchaseToValidate.params;           
        var accNumHash = await ReusableFunctions.getAccountNumPlusDigitHash(purchaseToValidate.number);     
        var creditCardFound = await TransactionModel.findCreditCard(accNumHash);    
        if (creditCardFound.error) {
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        if (creditCardFound.cc != null && creditCardFound.cc != "" && Object.keys(creditCardFound.cc).length != 0) {
            var res = await checkCreditCard(purchaseToValidate, creditCardFound);            
            if(res.error){
                return res;
            }            
            var todayDate = new Date();
            todayDate = moment(todayDate, config.default_expires_format).toDate();
            var newTransaction = {};
            newTransaction.amount = purchaseToValidate.transaction_amount;
            newTransaction.origin = purchaseToValidate.transaction_origin;
            newTransaction.detail = purchaseToValidate.transaction_detail;
            newTransaction.date = await ReusableFunctions.getTodayDate();
            newTransaction.status = "Complete";
            newTransaction.creditCardAcNumber = accNumHash;          
            creditCardFound.cc.currentAmount = res;            
            var respModel = await TransactionModel.createTransaction(newTransaction);            
            if (respModel.error) {
                return { message: messages.DATABASE_ERROR, codeMessage: "DATABASE_ERROR", error: true, errorDetail: respModel.errorDetail }
            } else {
                var respCCUpdated = await TransactionModel.updateCC(creditCardFound.cc);    
                if(respCCUpdated.error){                  
                    return { message: messages.DATABASE_ERROR, codeMessage: "DATABASE_ERROR", error: true, errorDetail: respCCUpdated.errorDetail }
                }
            
                return { message: messages.TRANSACTION_CREATED, codeMessage: "TRANSACTION_CREATED", error: false, transactionID: respModel._id, made_by: body.made_by, provider: body.made_by }
            }
        } else {
            return { message: messages.CREDITCARD_DONOT_BELONG_EMISOR, codeMessage: "CREDITCARD_DONOT_BELONG_EMISOR", error: true }
        }
    } catch (error) {
        console.log(stLogTitle, error);
        return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true, errorDetail: error }
    }
}

async function checkCreditCard(purchaseToValidate, creditCardFound) {
    var stLogTitle = "validateCreditCard";
    try {
        var numerCC = purchaseToValidate.number;         
        if(!luhn.validate(numerCC)){          
            return {message: messages.DONOT_MET_LUNH_ALGORITHM, codeMessage:"DONOT_MET_LUNH_ALGORITHM",error:true}; 
        }
        if(purchaseToValidate.name.toUpperCase() != creditCardFound.cc.customerName.toUpperCase()){
            return { message: messages.INCORRECT_CUTOMER_NAME, codeMessage: "INCORRECT_CUTOMER_NAME", error: true};            
        }        
        if(creditCardFound.cc.status == "Blocked"){
            return { message: messages.CREDITCARD_BLOCKED, codeMessage: "CREDITCARD_BLOCKED", error: true };            
        }
        if(creditCardFound.cc.status == "Denounced"){
            return { message: messages.CREDIT_CARD_DENOUNCED, codeMessage: "CREDIT_CARD_DENOUNCED", error: true };
        }
        var binHahs = await ReusableFunctions.getBinNumberHash(numerCC);
        var binFound = await TransactionModel.findBin(creditCardFound.cc.binNumber);
        if (binFound.error) {
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }        
        if (purchaseToValidate.expires == undefined) {
            return { message: messages.ENTER_EXPIRED_DATE, codeMessage: "ENTER_EXPIRED_DATE", error: true }
        }
        var dateToValidate = moment(purchaseToValidate.expires, config.default_expires_format).toDate();
        var expireDate = moment(creditCardFound.cc.expires, config.default_expires_format).toDate();
        var todayDate = await ReusableFunctions.getTodayDate();
        if (todayDate.getTime() > expireDate.getTime()) {
            return { message: messages.EXPIRED_CARD, codeMessage: "EXPIRED_CARD", error: true }
        }
        if (!(dateToValidate.getTime() == expireDate.getTime())) {
            return { message: messages.INCORRECT_EXPIRED_DATE, codeMessage: "INCORRECT_EXPIRED_DATE", error: true }
        }
        if (purchaseToValidate.transaction_amount == null || parseFloat(purchaseToValidate.transaction_amount) <= 0) {
            return { message: messages.INCORRECT_AMOUNT, codeMessage: "INCORRECT_AMOUNT", error: true }
        }
        if (purchaseToValidate.transaction_origin == null || purchaseToValidate.transaction_origin == "" || purchaseToValidate.transaction_origin == undefined) {
            return { message: messages.ORIGIN_NEEDED, codeMessage: "ORIGIN_NEEDED", error: true }
        }
        if (purchaseToValidate.transaction_detail == null || purchaseToValidate.transaction_detail == "" || purchaseToValidate.transaction_detail == undefined) {
            return { message: messages.DETAIL_NEEDED, codeMessage: "DETAIL_NEEDED", error: true }
        }
        var newAmount = parseFloat(creditCardFound.cc.currentAmount) + parseFloat(purchaseToValidate.transaction_amount);
        if (parseFloat(newAmount) > parseFloat(creditCardFound.cc.limitAmount)) {
            return { message: messages.CREDIT_CARD_EXCEED_LIMIT, codeMessage: "CREDIT_CARD_EXCEED_LIMIT", error: true }
        }
        var secCodeCalculated = await ReusableFunctions.getSecurityCode(numerCC, purchaseToValidate.expires);
        if (secCodeCalculated != purchaseToValidate.security_code) {
            return { message: messages.INCORRECT_SECURITY_CODE, codeMessage: "INCORRECT_SECURITY_CODE", error: true }
        }   
        return newAmount;       

    } catch (error) {
        console.log(stLogTitle, error);
        return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true, errorDetail: error };
    }
}

module.exports = { createTransaction }; 