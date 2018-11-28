const superagent = require("superagent");
const GatewayService = require("./verification.service");
const messages = require("../messages.json");
const config = require("../config.json");
const bcrypt = require("bcrypt");
const Transaction = require("../transaction/transaction.model");
const moment = require("moment");

exports.purchase_verify = async function (req,res){    
    console.log("Received purchase verify");            
    if (req.body.params.number && req.body.operation && req.body.params && req.body.made_by){
        if (req.headers.authorization && bcrypt.compareSync(config.tepagoya_key,req.headers.authorization)){
            network = await GatewayService.getNetwork(req.body.params.number);                                     
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
                res.status(500).json({ message: messages.VERIFICATION.NETWORK_NOT_FOUND});
            }
        } else{
            res.status(400).json({ message : messages.VERIFICATION.INVALID_KEY});
        }
    } else{        
        res.status(400).json({ message : messages.VERIFICATION.INCOMPLETE_REQUEST});
    }
}