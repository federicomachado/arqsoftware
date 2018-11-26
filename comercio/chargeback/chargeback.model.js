
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

exports.updatePurchase  = async function updatePurchase(aPurchase){
    var stLogTitle = "updatePurchase - Model";
    try{
        let objRes ={};
        var newPurch = {};
        newPurch.amountReturned = parseFloat(aPurchase.amount);     
        newPurch.dateReturned = aPurchase.date;
        newPurch.status = aPurchase.status;         
        var newPurchase = new Purchase(newPurch);
        objRes = await newPurchase.save().catch( err => {        
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
