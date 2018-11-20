const crypto = require("crypto");
const Transaction = require('./verification.model');
const Threshold = require('../threshold/threshold.model');
const  config = require("../config.json");
const messages = require("../messages.json");

exports.validatePurchase = async function( req ){
    var number = await crypto.createHash("sha256",req.body.params.number).digest("base64");        
    var fraud = await this.isFraud(number);
    if (fraud){
        return {status:400, message : messages.VERIFICATION.LIMIT_REACHED};   
    } else{
        var emisor = await this.getEmisor(req.body.params.number);
        if (emisor) {
            var transaction = new Transaction({ number: number, date: new Date()  });        
            transaction.save();        
            return { status:200, provider: emisor, operation: req.body.operation, params: req.body.params};            
        } 
        else{
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

