
const ReusableFunctions = require("../utils/reusableFunctions.js");

exports.findTransaction  = async function findTransaction(transactionID){
    var stLogTitle = "findTransaction - Model";
    try{       
        var res =  await ReusableFunctions.findTransaction(transactionID)
        return res;
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.createTransaction  = async function createTransaction(aTransaction){
    var stLogTitle = "createTransaction - Model";
    try{
        var resp = await ReusableFunctions.createTransaction(aTransaction);
        return resp;   
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.updateTransaction  = async function updateTransaction(aTransaction){
    var stLogTitle = "updateTransaction - Model";
    try{
        var res = await ReusableFunctions.updateTransaction(aTransaction);
        return res;
    }catch(error){
        console.log(stLogTitle,error);
    }
   
};
exports.updateCC  = async function updateCC(ccAcNum,newCCAmount){
    var stLogTitle = "updateCC - Model";
    try{       
        var updatedCC = await ReusableFunctions.updateCC(ccAcNum,newCCAmount);
        return updatedCC;
    
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

exports.findCreditCard  = async function findCreditCard(accNumHash){
    var stLogTitle = "findCreditCard - Model";
    try{  
        var cc =  await ReusableFunctions.findCreditCard(accNumHash);
        return cc;
    }catch(error){
        console.log(stLogTitle,error);
    }   
};

