const CreditCard = require('../models/creditCard.model');

exports.findCreditCard  = async function findCreditCard(atransaction){
    var stLogTitle = "findCreditCard - Model";
    try{
        var trans =  await CreditCard.findOne({'number': atransaction.creditCard.numberCreditCard});   
        return trans;

    }catch(error){
        console.log(stLogTitle,error);
    }
   
};

exports.createTransaction = async function createTransaction(aCreditCard){
    var stLogTitle = "createTransaction - Model";
    try{
        var objRes = {};
        objRes.error = false;
         aCreditCard.save(err => {      
            if (err) {
                objRes.error = true;
                objRes.errorDetail = err;          
            }      
        });
        return objRes;

    }catch(error){
        console.log(stLogTitle,error);

    }

}

