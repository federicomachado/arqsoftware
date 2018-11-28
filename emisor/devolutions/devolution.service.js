const DevolutionModel = require('./devolution.model.js');  
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");
const Log = require("../logs/"+config.log_service+".service");

exports.createDevolution = async function (transactionIDBody,res) {
    var stLogTitle = "createDevolution - Service";
    try { 
      
        body = transactionIDBody;
        var transactionId = transactionIDBody.params.transactionId;
            
        if(transactionId == undefined){
            Log.log("TRANSACTION_ID_REQUIRED",transactionIDBody);
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }     
        var transactionFound = await DevolutionModel.findTransaction(transactionId); 
         
        if(transactionFound.error){         
            Log.log("TRANSACTION_NOT_FOUND",transactionIDBody);
            return { message: messages.TRANSACTION_NOT_FOUND, codeMessage: "TRANSACTION_NOT_FOUND", error: true};
        }      
        if(transactionFound.status == "Chargeback"){           
            Log.log("TRANSACTION_WITH_CHARGEBACK",transactionIDBody);
            return { message: messages.TRANSACTION_WITH_CHARGEBACK, codeMessage: "TRANSACTION_WITH_CHARGEBACK", error: true};
        } 
        var daysTransCreated = ReusableFunctions.calculateDaysTransaction(transactionFound.date);
  
        if(parseInt(daysTransCreated) > parseInt(config.count_days_devolution)){
            Log.log("DEVOLUTION_DAY_EXCEEDED",transactionIDBody);
            return { message: messages.DEVOLUTION_DAY_EXCEEDED + daysTransCreated, codeMessage: "DEVOLUTION_DAY_EXCEEDED", error: true};
        }        

        var transactionDateOld = transactionFound.date;
        var newTransaction = transactionFound;
        newTransaction.status = "Complete";
        newTransaction.amount = parseFloat(transactionFound.amount)*-1;
        newTransaction.contrastedTransaction = transactionId;
        newTransaction.date = await ReusableFunctions.getTodayDate();
      
        var transactionCreated= await DevolutionModel.createTransaction(newTransaction); 
     
        if(transactionCreated.error){
            Log.log("CONEXION_ERROR",transactionIDBody);
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var idTransactionCreated = transactionCreated._id;
        transactionFound.status = "Returned";
        transactionFound.contrastedTransaction = idTransactionCreated;
        transactionFound.date = transactionDateOld;
  
        var originalTransUpdated = await DevolutionModel.updateTransaction(transactionFound);
  
        if(originalTransUpdated.error){
            Log.log("CONEXION_ERROR",transactionIDBody);
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }

        transactionFound.status = "Returned";
        transactionFound.amountRetuned = transactionFound.amount; 
        transactionFound.dateReturned = await ReusableFunctions.getTodayDate();       
        var transactionUpdated = await DevolutionModel.updateTransaction(transactionFound,transactionId);
        if(transactionUpdated.error){          
            Log.log("CONEXION_ERROR",transactionIDBody);
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }        
        var ccFound = await DevolutionModel.findCreditCard(transactionFound.creditCardAcNumber);
        if(ccFound.error){
            Log.log("CONEXION_ERROR",transactionIDBody);
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
      
        var newValue = parseFloat(ccFound.currentAmount) + parseFloat(newTransaction.amount); 
        var respCCUpdated = await DevolutionModel.updateCC(transactionFound.creditCardAcNumber,newValue);  
        if(respCCUpdated.error){
            Log.log("CONEXION_ERROR",transactionIDBody);
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }        
  
       var info = {};
       info.transactionId = transactionId;
       info.message = messages.DEVOLUTION_DONE;               
       return {provider:body.made_by, operation: "devolution", params : info, made_by : body.made_by };

    } catch(error){
        Log.log(stLogTitle,{error});
        console.log(stLogTitle,error);
    }
}


exports.create_devolution_route = async function(req,res){
    var objResp = await this.create_devolution_cont(req.body,res);        
    if(objResp.error){
        Log.log("DEVOLUTION_ERROR",{objResp});
        return res.status(400).send(objResp);
    }else{    
        return res.status(201).send(objResp);
    }  
}

exports.create_devolution_cont = async function (req,res){
    var stLogTitle = "createChargeback - Controller";
    try{
       var respService = await this.createDevolution(req,res);
       return respService;
 
    }catch(error){
       Log.log(stLogTitle,{error});
       console.log(stLogTitle,error);
    }
    
}

