const superagent = require("superagent");
const GatewayService = require("./verification.service");
const messages = require("../messages.json");
const config = require("../config.json");

exports.purchase_verify = async function (req,res){    
    console.log("Received purchase verify");    
    console.log(req.headers.authorization);
    if (req.body.params.number && req.body.operation && req.body.params && req.body.made_by){
        if (req.headers.authorization && req.headers.authorization == config.tepagoya_key){
            network = await GatewayService.getNetwork(req.body.params.number);             
            console.log("Network: " + network);
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