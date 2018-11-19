const CreditCard = require('../models/creditCard.model');

exports.findCreditCard  = async function findCreditCard(atransaction){
    var stLogTitle = "findCreditCard - Model";
    try{
        var trans =  await CreditCard.findOne({'number': atransaction.creditCard.number});   
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
        console.log("aCreditCard",aCreditCard);
        var objRes = await aCreditCard.save(err => {      
            if (err) {
                objRes.error = true;
                objRes.errorDetail = err; 
                console.log("err 4444444444444444444444444",err);                 
            }  
            console.log("objRes 333333",objRes);
                
        });
        console.log("objRes 2222222",objRes);
        return objRes;  
     
       

    }catch(error){
        console.log(stLogTitle,error);
    }
}

