const VerifyService = require("./verification.service");

exports.purchase_verify = async function (req,res){    
    console.log("Received purchase verify");            
   return VerifyService.purchase_verify(req,res);
}