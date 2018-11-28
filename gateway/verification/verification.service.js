const config = require("../config.json")
const messages = require("../messages.json");
const bcrypt = require("bcrypt");
const Transaction = require("../transaction/transaction.model");
const moment = require("moment");
const Log = require("../logs/"+config.log_service+".service");

exports.getNetwork = async function ( number ){    
    var hash = config.networks_hash;    
    var contador = 0;
    var found = false;   
    while ( !found ) {
        hash = hash[number[contador]]
        if (!hash) {
            return "";
        }
        else{
            if (hash[number[contador+1]] == undefined) {
                return hash[""];
            }    
        }   
        contador+=1; 
    }    
}

exports.purchase_verify = async function (req,res){
    if (req.body.params.number && req.body.operation && req.body.params && req.body.made_by){
        if (req.headers.authorization && bcrypt.compareSync(config.tepagoya_key,req.headers.authorization)){
            network = await this.getNetwork(req.body.params.number);                                     
            if (network) {                    
                let old_date = req.body.params.transaction_date;                
                let date = moment(req.body.params.transaction_date,"DD/MM/YY HH:mm:ss")                
                date = date.format();
                req.body.params.transaction_date = date;                    
                let transaction = new Transaction(req.body.params);                    
                transaction = await transaction.save();                
                req.body.params.transaction_date = old_date;
                res.status(200).json({ provider: network, made_by : req.body.made_by, operation: req.body.operation, params: req.body.params});
            } else{
                Log.log(messages.VERIFICATION.NETWORK_NOT_FOUND,req.body);
                res.status(500).json({ message: messages.VERIFICATION.NETWORK_NOT_FOUND});
            }
        } else{
            Log.log(messages.VERIFICATION.INVALID_KEY,req.body);
            res.status(400).json({ message : messages.VERIFICATION.INVALID_KEY});
        }
    } else{        
        Log.log(messages.VERIFICATION.INCOMPLETE_REQUEST,req.body);
        res.status(400).json({ message : messages.VERIFICATION.INCOMPLETE_REQUEST});
    }
}