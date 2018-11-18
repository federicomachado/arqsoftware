const CreditCard = require('../models/creditCard.model');

exports.findCreditCard  = async function findCreditCard(atransaction){
    var trans =  await CreditCard.findOne({'number': atransaction.creditCard.numberCreditCard});
    console.log("trans: "+ JSON.stringify(trans));
    return trans;
};

exports.createTransaction = async function createTransaction(aCreditCard){
    var objRes = {};
    aCreditCard.save(err => {      
        if (err) {
            objRes.error = true;
            objRes.errorDetail = err;          
        }else{
            objRes.error = false;
            objRes.creditCard = aCreditCard;
        }    
      
    });
    return objRes;

}

