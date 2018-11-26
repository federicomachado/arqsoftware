const DevolutionModel = require('./devolution.model');
const messages = require("../messages.json");
const config = require("../config.json");
var moment = require("moment");
const superagent = require("superagent");

async function createDevolution (purchaseIDBody) {
    var stLogTitle = "createDevolution - Service";
    try {   
        if(purchaseIDBody.purchaseId == undefined){
            return { message: messages.PURCHASE_ID_REQUIRED, codeMessage: "PURCHASE_ID_REQUIRED", error: true};
        }        
        var purchaseId = purchaseIDBody.purchaseId;
        var purchaseFound = await DevolutionModel.findPurchase(purchaseId); 
        console.log("purchaseFound: "+JSON.stringify(purchaseFound));
        if(purchaseFound.error){
            return { message: messages.PURCHASE_NOT_FOUND, codeMessage: "PURCHASE_NOT_FOUND", error: true};
        }    
        if(purchaseFound.status == "Returned"){
            return { message: messages.PURCHASE_ALREADY_RETURNED, codeMessage: "PURCHASE_ALREADY_RETURNED", error: true};
        }
        purchaseFound.status = "Returned";
        purchaseFound.amountRetuned = purchaseFound.amount;
        purchaseFound.dateReturned = await getTodayDate();

        var purchaseUpdated = await DevolutionModel.updatePurchase(purchaseFound);
        if(purchaseUpdated.error){
            return { message: messages.CONEXION_ERROR, codeMessage: "CONEXION_ERROR", error: true};        
        }     
        var info = {
            transactionId: purchaseId,
            message: messages.CHARGEBACK_RECEIVED
        } 
        /*       
        superagent.post(config.tepagoya_url).send({provider : transactionFound.origin, operation: "chargeback", params : info, made_by : config.provider_name }).end(function(err,resp){
            if (err){
                console.log("err emisor:"+err );
                //return resp.status(500).json({error : err});
            }  
         
        });  
        */

        return { message: messages.CHARGEBACK_RECEIVED, codeMessage: "CHARGEBACK_RECEIVED", error: false};

    } catch(error){
        console.log(stLogTitle,error);
    }
}

async function getTodayDate() {
    var stLogTitle = "getTodayDate";
    try {
        var todayDate = new Date();
        return moment(todayDate, config.default_expires_format).toDate();
    } catch (error) {
        console.log(stLogTitle, error);
    }
}

module.exports = {createDevolution}; 