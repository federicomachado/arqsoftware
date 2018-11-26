
const Purchase = require('../models/purchase.model');

exports.findPurchase  = async function findPurchase(transactionID){
    var stLogTitle = "findPurchase - Model";
    try{
        let objRes ={};
        var purchaseFound =  await Purchase.findOne({'transaction_code': transactionID}).catch( err => {        
            if (err){                            
                objRes.error = true;
                objRes.errorDetail = err;
                return objRes;
            }                       
        });       
        return purchaseFound;

    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.updatePurchase  = async function updatePurchase(aPurchase,transactionId){
    var stLogTitle = "updatePurchase - Model";
    try{
        let objRes ={};
        var query = {'transaction_code': transactionId};       
        var updatedTrans = await Purchase.findOneAndUpdate(query, {"$set":{"status": aPurchase.status, "amountReturned":aPurchase.amount,"dateReturned":aPurchase.dateReturned}}, {upsert:false}, function(err, doc){
            if (err) {
                objRes.error = true;
                objRes.errorDetail = err;
                return objRes;
            }     
        });
        return updatedTrans;
    }catch(error){
        console.log(stLogTitle,error);
    }
   
};
