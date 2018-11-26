
var moment = require("moment");
const config = require("../config.json");
const crypto = require("crypto");
const CreditCard = require('../models/creditCard.model');
const Transaction = require('../models/transaction.model.js');


exports.calculateDaysTransaction  = function calculateDaysTransaction(transactionDate){
    var stLogTitle = "calculateDaysTransaction";
    try {   
        var todayDate = moment(new Date(), config.default_expires_format).toDate();
        var transDate = moment(transactionDate, config.default_expires_format).toDate();
        var diasdif= todayDate.getTime()-transDate.getTime();
        var countDays = Math.round(diasdif/(1000*60*60*24));
        return countDays;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getTodayDate  = async function getTodayDate() {
    var stLogTitle = "getTodayDate";
    try {
        var todayDate = new Date();
        return moment(todayDate, config.default_expires_format).toDate();
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getSecurityCode  = async function getSecurityCode(number, expireDate) {
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
exports.getBinNumberHash  = async function getBinNumberHash(numCC) {
    var stLogTitle = "getBinNumberHash";
    try {
        numCC = numCC.substring(0, 6);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getAccountNumPlusDigitHash  = async function getAccountNumPlusDigitHash(numCC) {
    var stLogTitle = "getAccountNumPlusDigitHash";
    try {
        numCC = numCC.substring(numCC.length - 10, numCC.length);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}

exports.findCreditCard  = async function findCreditCard(accNumHash){
    var stLogTitle = "findCreditCard - reusableFunctions";
    try{  
        let objRes ={};  
        var cc = await CreditCard.findOne({'accountNumberPlusDigit': accNumHash}).catch( err => {        
            if (err){                            
                objRes.error = true;
                objRes.errorDetail = err;
                return objRes;
            }                       
        });      
        return cc;
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.updateCC  = async function updateCC(ccAcNum,newCCAmount){
    var stLogTitle = "updateCC - reusableFunctions";
    try{       
        var query = {'accountNumberPlusDigit':ccAcNum};        
         var updatedCC = await CreditCard.findOneAndUpdate(query, {"currentAmount":newCCAmount}, {upsert:false}, function(err, doc){
            if (err) {
                console.log("err1: "+ err)
            }     
            console.log("savedddd: ");
        });
        return updatedCC;
    
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.createTransaction  = async function createTransaction(aTransaction){
    var stLogTitle = "createTransaction - reusableFunctions";
    try{
        let objRes ={};
        var newTrans = {};
        newTrans.amount = parseFloat(aTransaction.amount);
        newTrans.origin = aTransaction.origin;
        newTrans.date = aTransaction.date;
        newTrans.status = aTransaction.status;
        newTrans.creditCardAcNumber = aTransaction.creditCardAcNumber;
        newTrans.contrastedTransaction = aTransaction.contrastedTransaction;
        newTrans.detail = aTransaction.detail;        
        var newTransaction = new Transaction(newTrans);
        objRes = await newTransaction.save().catch( err => {        
            if (err){                           
                objRes.error = true;
                objRes.errorDetail = err;
                return objRes;
            }                        
        });
        return objRes;   
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.updateTransaction  = async function updateTransaction(aTransaction){
    var stLogTitle = "updateTransaction - reusableFunctions";
    try{
        var query = {'_id':aTransaction._id};       
        var updatedTrans = await Transaction.findOneAndUpdate(query, {"$set":{"status": aTransaction.status, "contrastedTransaction":aTransaction.contrastedTransaction}}, {upsert:false}, function(err, doc){
            if (err) {
                console.log("err1: "+ err)
            }     
        });
        return updatedTrans;
    }catch(error){
        console.log(stLogTitle,error);
    }
   
};

exports.findTransaction  = async function findTransaction(transactionID){
    var stLogTitle = "findTransaction - reusableFunctions";
    try{       
        let objRes ={};
        var transactionFound =  await Transaction.findOne({'_id': transactionID}).catch( err => {        
            if (err){                            
                objRes.error = true;
                objRes.errorDetail = err;
                return objRes;
            }                       
        });       
        return transactionFound;

    }catch(error){
        console.log(stLogTitle,error);
    }   
};