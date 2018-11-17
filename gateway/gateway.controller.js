const superagent = require("superagent");
const config = require("./config");
const GatewayService = require("./gateway.service");

exports.purchase_verify = async function (req,res){
    console.log("Received request from TePagoYa");
    if (req.body.params.number && req.body.operation && req.body.params && req.body.made_by){
         network = await GatewayService.getNetwork(req.body.number);        
         if (network) {
            res.status(200).json({ provider: req.body.made_by, operation: req.body.operation, params: req.body.params});
         } else{
            res.status(500).json({ message: "No network found for credit card number"});
         }
    } else{
        console.log(req.body);
        res.status(400).json({ message : "Incomplete request"});
    }
}