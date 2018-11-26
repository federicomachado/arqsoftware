const TransactionModel = require('./createTransaction.model');
const messages = require("../messages.json");
const config = require("../config.json");
var luhn = require("luhn");
const crypto = require("crypto");
var moment = require("moment");

async function createTransaction(ccToValidate) {    
    var stLogTitle = "createTransaction - Service";
    try {
        body = ccToValidate;
        ccToValidate = ccToValidate.params;        
        var accNumHash = await getAccountNumPlusDigitHash(ccToValidate.number);     
        var creditCardFound = await TransactionModel.findCreditCard(accNumHash);    
        if (creditCardFound.error) {
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        if (creditCardFound.cc != null && creditCardFound.cc != "" && Object.keys(creditCardFound.cc).length != 0) {
            var res = await checkCreditCard(ccToValidate, creditCardFound);            
            if(res.error){
                return res;
            }            
            var todayDate = new Date();
            todayDate = moment(todayDate, config.default_expires_format).toDate();
            var newTransaction = {};
            newTransaction.amount = ccToValidate.transaction_amount;
            newTransaction.origin = ccToValidate.transaction_origin;
            newTransaction.detail = ccToValidate.transaction_detail;
            newTransaction.date = await getTodayDate();
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
            console.log("ENTRO AL PRIMER ELSE");
            return { message: messages.CREDITCARD_DONOT_BELONG_EMISOR, codeMessage: "CREDITCARD_DONOT_BELONG_EMISOR", error: true }
        }
    } catch (error) {
        console.log(stLogTitle, error);
        return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true, errorDetail: error }
    }
}

async function checkCreditCard(ccToValidate, creditCardFound) {
    var stLogTitle = "validateCreditCard";
    try {
        var numerCC = ccToValidate.number;         
        if(!luhn.validate(numerCC)){          
            return {message: messages.DONOT_MET_LUNH_ALGORITHM, codeMessage:"DONOT_MET_LUNH_ALGORITHM",error:true}; 
        }
        if(ccToValidate.name.toUpperCase() != creditCardFound.cc.customerName.toUpperCase()){
            return { message: messages.INCORRECT_CUTOMER_NAME, codeMessage: "INCORRECT_CUTOMER_NAME", error: true};            
        }        
        if(creditCardFound.cc.status == "Blocked"){
            return { message: messages.CREDITCARD_BLOCKED, codeMessage: "CREDITCARD_BLOCKED", error: true };            
        }
        if(creditCardFound.cc.status == "Denounced"){
            return { message: messages.CREDIT_CARD_DENOUNCED, codeMessage: "CREDIT_CARD_DENOUNCED", error: true };
        }
        var binHahs = await getBinNumberHash(numerCC);
        var binFound = await TransactionModel.findBin(creditCardFound.cc.binNumber);
        if (binFound.error) {
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        
        if (ccToValidate.expires == undefined) {
            return { message: messages.ENTER_EXPIRED_DATE, codeMessage: "ENTER_EXPIRED_DATE", error: true }
        }
        var dateToValidate = moment(ccToValidate.expires, config.default_expires_format).toDate();
        var expireDate = moment(creditCardFound.cc.expires, config.default_expires_format).toDate();
        var todayDate = await getTodayDate();
        if (todayDate.getTime() > expireDate.getTime()) {
            return { message: messages.EXPIRED_CARD, codeMessage: "EXPIRED_CARD", error: true }
        }
        if (!(dateToValidate.getTime() == expireDate.getTime())) {
            return { message: messages.INCORRECT_EXPIRED_DATE, codeMessage: "INCORRECT_EXPIRED_DATE", error: true }
        }
        if (ccToValidate.transaction_amount == null || parseFloat(ccToValidate.transaction_amount) <= 0) {
            return { message: messages.INCORRECT_AMOUNT, codeMessage: "INCORRECT_AMOUNT", error: true }
        }
        if (ccToValidate.transaction_origin == null || ccToValidate.transaction_origin == "" || ccToValidate.transaction_origin == undefined) {
            return { message: messages.ORIGIN_NEEDED, codeMessage: "ORIGIN_NEEDED", error: true }
        }
        if (ccToValidate.transaction_detail == null || ccToValidate.transaction_detail == "" || ccToValidate.transaction_detail == undefined) {
            return { message: messages.DETAIL_NEEDED, codeMessage: "DETAIL_NEEDED", error: true }
        }
        var newAmount = parseFloat(creditCardFound.cc.currentAmount) + parseFloat(ccToValidate.transaction_amount);
        if (parseFloat(newAmount) > parseFloat(creditCardFound.cc.limitAmount)) {
            return { message: messages.CREDIT_CARD_EXCEED_LIMIT, codeMessage: "CREDIT_CARD_EXCEED_LIMIT", error: true }
        }
        var secCodeCalculated = await getSecurityCode(numerCC, ccToValidate.expires);
        if (secCodeCalculated != ccToValidate.security_code) {
            return { message: messages.INCORRECT_SECURITY_CODE, codeMessage: "INCORRECT_SECURITY_CODE", error: true }
        }   
        return newAmount;       

    } catch (error) {
        console.log(stLogTitle, error);
        return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true, errorDetail: error };
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
async function getBinNumberHash(numCC) {
    var stLogTitle = "getBinNumberHash";
    try {
        numCC = numCC.substring(0, 6);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
async function getAccountNumPlusDigitHash(numCC) {
    var stLogTitle = "getAccountNumPlusDigitHash";
    try {
        numCC = numCC.substring(numCC.length - 10, numCC.length);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }

}
async function getSecurityCode(number, expireDate) {
    var stLogTitle = "getSecurityCode";
    try {
        var arrDate = [];
        if (expireDate.indexOf("/")) {
            arrDate = expireDate.split("/");
        } else if (expireDate.indexOf("-")) {
            arrDate = expireDate.split("-");
        }
        var dateToSum = arrDate[0] + arrDate[1];
        number = number + dateToSum;
        var arrNum = number.split("");
        var sum = 0;
        for (var i = 0; i < arrNum.length; i++) {
            sum = parseInt(sum) + parseInt(arrNum[i]);
        }
        return formatnumber(parseInt(sum));
    } catch (error) {
        console.log(stLogTitle, error);
    }

}
function formatnumber(number) {
    var format = "00" + number;
    format = format.substring(format.length - 3, format.length);
    return format;
}

module.exports = { createTransaction }; 