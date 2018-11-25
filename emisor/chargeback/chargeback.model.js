
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
        objRes.transaction = transactionFound;
        return objRes;

    }catch(error){
        console.log(stLogTitle,error);
    }
   
};
exports.updateCC  = async function updateCC(ccAcNum){
    var stLogTitle = "findTransaction - Model";
    try{
        console.log("ccAcNum: "+ccAcNum);
        var query = {'accountNumberPlusDigit':ccAcNum};       
         var updatedCC = await CreditCard.findOneAndUpdate(query, {currentAmount: 20}, {upsert:false}, function(err, doc){
            if (err) {
                console.log("err1: "+ err)
            }     
            console.log("savedddd: ");
        });
        console.log("updatedCC: "+ updatedCC);
    }catch(error){
        console.log(stLogTitle,error);
    }
   
};