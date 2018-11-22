const superagent = require("superagent");
const GatewayService = require("./gateway.service");

exports.gateway_create = async function (req,res){  
    if (req.body && req.body.category && req.body.name){
        return await GatewayService.gateway_create(res,req.body.name, req.body.category);    
    }
    else{
        return res.status(400).json({error: messages.GATEWAY.INVALID_FORMAT});
    }        
}            



