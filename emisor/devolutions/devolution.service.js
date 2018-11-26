const DevolutionModel = require('./devolution.model.js');  
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");

async function createDevolution (transactionIDBody) {
    var stLogTitle = "createDevolution - Service";
    try { 
        console.log("transactionIDBody: "+JSON.stringify(transactionIDBody));  
        var transactionId = transactionIDBody.params.transactionId;
            
        if(transactionId == undefined){
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }     
        var transactionFound = await DevolutionModel.findTransaction(transactionId); 
         
        if(transactionFound.error){         
            return { message: messages.TRANSACTION_NOT_FOUND, codeMessage: "TRANSACTION_NOT_FOUND", error: true};
        }      
        if(transactionFound.status == "Chargeback"){           
            return { message: messages.TRANSACTION_WITH_CHARGEBACK, codeMessage: "TRANSACTION_WITH_CHARGEBACK", error: true};
        } 
        var daysTransCreated = ReusableFunctions.calculateDaysTransaction(transactionFound.date);
  
        if(parseInt(daysTransCreated) > parseInt(config.count_days_devolution)){
         
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
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
        var idTransactionCreated = transactionCreated._id;
        transactionFound.status = "Returned";
        transactionFound.contrastedTransaction = idTransactionCreated;
        transactionFound.date = transactionDateOld;
  
        var originalTransUpdated = await DevolutionModel.updateTransaction(transactionFound);
  
        if(originalTransUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }

        transactionFound.status = "Returned";
        transactionFound.amountRetuned = transactionFound.amount; 
        transactionFound.dateReturned = await ReusableFunctions.getTodayDate();       
        var transactionUpdated = await DevolutionModel.updateTransaction(transactionFound,transactionId);
        if(transactionUpdated.error){          
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }        
        var ccFound = await DevolutionModel.findCreditCard(transactionFound.creditCardAcNumber);
        if(ccFound.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }
      
        var newValue = parseFloat(ccFound.currentAmount) + parseFloat(newTransaction.amount); 
        var respCCUpdated = await DevolutionModel.updateCC(transactionFound.creditCardAcNumber,newValue);  
        if(respCCUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};
        }        

           /*      
        superagent.post(config.tepagoya_url).send({provider:purchaseFound.emisor, operation: "devolution", params : info, made_by : config.provider_name }).end(function(err,resp){
            if (err){
                console.log("err emisor:"+err );
                //return resp.status(500).json({error : err});
            }  
         
        });  
        */       
       var info = {};
       info.transactionId = transactionId;
       info.message = DEVOLUTION_DONE;       
        
        return {provider:body.made_by, operation: "devolution", params : info, made_by : config.provider_name };

    } catch(error){
        console.log(stLogTitle,error);
    }
}


module.exports = {createDevolution}; 