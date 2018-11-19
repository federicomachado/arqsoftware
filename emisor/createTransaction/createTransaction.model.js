const CreditCard = require('../models/creditCard.model');

exports.findCreditCard  = async function findCreditCard(atransaction){
    var stLogTitle = "findCreditCard - Model";
    try{
        var trans =  await CreditCard.findOne({'number': atransaction.number});   
        return trans;

    }catch(error){
        console.log(stLogTitle,error);
    }
   
};

exports.createTransaction = async function createTransaction(aCreditCard){
    var stLogTitle = "createTransaction - Model";
    try{
                            
    let objRes ={};
    objRes = await aCreditCard.save().catch( err => {        
        if (err){                            
            objRes.error = true;
            return objRes;
        }                        
    });

    var indexArrNewTran = objRes.transactions.length;
    objRes.transactionID = objRes.transactions[indexArrNewTran - 1].id; 
    return objRes;     

    }catch(error){
        console.log(stLogTitle,error);
    }

}

