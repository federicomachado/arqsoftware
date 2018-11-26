
const Transaction = require('../models/transaction.model');

exports.findPurchase  = async function findPurchase(transactionID){
    var stLogTitle = "findPurchase - Model";
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

exports.updatePurchase  = async function updatePurchase(aTransaction){
    var stLogTitle = "updatePurchase - Model";
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
