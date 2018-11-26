const DevolutionModel = require('./devolution.model');
const messages = require("../utils/messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");
const ReusableFunctions = require("../utils/reusableFunctions.js");

async function createDevolution (transactionIDBody,res) {
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

        var info = {
            transactionId: transactionId,
            message: messages.DEVOLUTION_DONE
        }       

  
       // console.log(" resresresresresres resresresresresresres: "+JSON.stringify(res)); 
         
        var authorization = res.getHeaders()["authorization"];
        console.log(purchaseFound);
       await superagent.post(config.tepagoya_url).send({provider:purchaseFound.emisor, operation: "devolution", params : info, made_by : config.provider_name }).set("authorization",authorization).end(function(err,resp){
            if (err){               
                return res.status(500).json({error : err});
            }  else{
                console.log(resp.body);           
                /*
                purchaseFound.status = "Returned";
                purchaseFound.amountRetuned = purchaseFound.amount; 
                purchaseFound.dateReturned = await ReusableFunctions.getTodayDate();        
                var purchaseUpdated = await DevolutionModel.updatePurchase(purchaseFound,transactionId);
                if(purchaseUpdated.error){
                    return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
                }     
                */ 

                return res.status(200).json(resp.body.params);
            }
            
        });                             
    } catch(error){
        console.log(stLogTitle,error);
    }
}


module.exports = {createDevolution}; 