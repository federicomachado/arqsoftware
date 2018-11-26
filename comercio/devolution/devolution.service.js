const DevolutionModel = require('./devolution.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");

async function createDevolution (transactionIDBody) {
    var stLogTitle = "createDevolution - Service";
    try {          
        if(transactionIDBody.transactionId == undefined){
            return { message: messages.TRANSACTION_ID_REQUIRED, codeMessage: "TRANSACTION_ID_REQUIRED", error: true};
        }
        var transactionId = transactionIDBody.transactionId;
        var purchaseFound = await DevolutionModel.findPurchase(transactionId);      
        if(purchaseFound.error){
            return { message: messages.PURCHASE_NOT_FOUND, codeMessage: "PURCHASE_NOT_FOUND", error: true};
        }      
        if(purchaseFound.status == "Returned"){
            return { message: messages.PURCHASE_ALREADY_RETURNED, codeMessage: "PURCHASE_ALREADY_RETURNED", error: true};
        }     
        purchaseFound.status = "Returned";
        purchaseFound.amountRetuned = purchaseFound.amount; 
        purchaseFound.dateReturned = await ReusableFunctions.getTodayDate();        
        var purchaseUpdated = await DevolutionModel.updatePurchase(purchaseFound,transactionId);
        if(purchaseUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }     
        var info = {
            transactionId: transactionId,
            message: messages.DEVOLUTION_DONE
        } 
        /*       
        superagent.post(config.tepagoya_url).send({provider : transactionFound.origin, operation: "chargeback", params : info, made_by : config.provider_name }).end(function(err,resp){
            if (err){
                console.log("err emisor:"+err );
                //return resp.status(500).json({error : err});
            }  
         
        });  
        */
        return { message: messages.DEVOLUTION_DONE, codeMessage: "DEVOLUTION_DONE", error: false};

    } catch(error){
        console.log(stLogTitle,error);
    }
}


module.exports = {createDevolution}; 