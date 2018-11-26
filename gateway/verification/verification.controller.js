const superagent = require("superagent");
const GatewayService = require("./verification.service");
const messages = require("../messages.json");
const config = require("../config.json");
const bcrypt = require("bcrypt");

exports.purchase_verify = async function (req,res){    
    console.log("Received purchase verify");        
    if (req.body.params.number && req.body.operation && req.body.params && req.body.made_by){
        if (req.headers.authorization && bcrypt.compareSync(config.tepagoya_key,req.headers.authorization)){
            network = await GatewayService.getNetwork(req.body.params.number);                         
            if (network) {             
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