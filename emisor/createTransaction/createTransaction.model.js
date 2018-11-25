const CreditCard = require('../models/creditCard.model');
const Bin = require('../models/bin.model');
const Transaction = require('../models/transaction.model');

exports.findCreditCard  = async function findCreditCard(accNumHash){
    var stLogTitle = "findCreditCard - Model";
    try{
  
        let objRes ={};  
        var cc = await CreditCard.findOne({'accountNumberPlusDigit': accNumHash}).catch( err => {        
            if (err){                            
                objRes.error = true;
                return objRes;
            }                       
        });
        objRes.cc = cc;
        return objRes;
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.findBin  = async function findBin(ccard){
    var stLogTitle = "findBin - Model";
    try{
        let objRes ={};
        var binFound =  await Bin.findOne({'idBin': ccard.binNumber}).catch( err => {        
            if (err){                            
                objRes.error = true;
                return objRes;
            }                       
        }); 
        objRes.bin = binFound;
        return objRes;

    }catch(error){
        console.log(stLogTitle,error);
    }
   
};

exports.createTransaction = async function createTransaction(aTransaction){
    var stLogTitle = "createTransaction - Model";
    try{
                                
        let objRes ={};
        var newTransaction = new Transaction(aTransaction);
        objRes = await newTransaction.save().catch( err => {        
            if (err){                            
                objRes.error = true;
                return objRes;
            }                        
        });
        console.log("newtransac: "+ objRes);

      //  var indexArrNewTran = objRes.transactions.length;
        //objRes.transactionID = objRes.transactions[indexArrNewTran - 1].id; 
        return objRes;     

    }catch(error){
        console.log(stLogTitle,error);
    }

}

