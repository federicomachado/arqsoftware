const crypto = require("crypto");
const Transaction = require('./verification.model');
const Threshold = require('../threshold/threshold.model');
const config = require("../config.json");
const messages = require("../messages.json");
const Log = require("../logs/"+config.log_service+".service");

exports.validatePurchase = async function( req ){
    var number = await crypto.createHash('sha256').update(req.body.params.number, 'utf8').digest('hex');
    var fraud = await this.isFraud(number);    
    if (fraud){  
        req.body.params = {};
        Log.log(messages.VERIFICATION.LIMIT_REACHED,req.body);      
        return {status:400, message : messages.VERIFICATION.LIMIT_REACHED};   
    } else{
        var emisor = await this.getEmisor(req.body.params.number);
        if (emisor) {
            var transaction = new Transaction({ number: number, date: new Date()  });        
            transaction.save();                    
            return { status:200, provider: emisor, operation: req.body.operation, params: req.body.params};            
        } 
        else{
            req.body.params = {};
            Log.log(messages.VERIFICATION.ISSUER_NOT_FOUND,req.body);  
            return {status:500, message : messages.VERIFICATION.ISSUER_NOT_FOUND};   
        }        
    }
}

exports.isFraud = async function( number ){        
    let transactions = await Transaction.aggregate([
        {
            "$match" : {
                "date" : { "$gt": new Date(Date.now() - 24*60*60*100*3) },
                "number" : { "$eq": number  }
            }
        }
    ]);    

    let threshold = await Threshold.findOne({reference : 1})
    let limit = threshold.limit;    
    return transactions.length > limit;    
}

exports.getEmisor = async function ( cc ) {
    hash = config.emisores_hash;    
    var contador = 0;
    var found = false;   
    while ( !found ) {             
        text = cc[contador]+cc[contador+1];        
        hash = hash[text]        
        if (!hash) {
            return "";
        }
        else{
            if (hash[cc[contador+2]+cc[contador+3]] == undefined) {
                return hash[""];
            }    
        }   
        contador+=2; 
    }    
}

exports.card_verify = async function (req,res){
    console.log("Received"); 
    if (req.body.params.number){
        var response = await this.validatePurchase(req);
        response.made_by = req.body.made_by;
        return res.status(response.status).json( response);
    }else{
        Log.log(messages.MISSING_NUMBER,req.body); 
        return  res.status(400).json({message: messages.VERIFICATION.MISSING_NUMBER});
    }
}

