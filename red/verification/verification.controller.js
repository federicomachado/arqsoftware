const superagent = require("superagent");
const VerificationService = require("./verification.service");


exports.card_verify = async function (req,res){    
    return VerificationService.card_verify(req,res);
   
}

