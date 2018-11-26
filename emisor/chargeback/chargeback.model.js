
const Transaction = require('../models/transaction.model');
const CreditCard = require('../models/creditCard.model');

exports.findTransaction  = async function findTransaction(transactionID){
    var stLogTitle = "findTransaction - Model";
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
exports.createTransaction  = async function createTransaction(aTransaction){
    var stLogTitle = "createTransaction - Model";
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
    var stLogTitle = "updateTransaction - Model";
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
exports.updateCC  = async function updateCC(ccAcNum,newCCAmount){
    var stLogTitle = "updateCC - Model";
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

exports.findCreditCard  = async function findCreditCard(accNumHash){
    var stLogTitle = "findCreditCard - Model";
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