const superagent = require("superagent");
const GatewayService = require("./gateway.service");

exports.gateway_create = async function (req,res){  
   return GatewayService.gateway_create_cont(req,res);
}            



