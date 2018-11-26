const superagent = require("superagent");
const config = require("./../config.json");
const VerificationService = require("./verification.service");
const messages = require("./../messages.json");

exports.card_verify = async function (req,res){    
    console.log("Received"); 
   if (req.body.params.number){
       var response = await VerificationService.validatePurchase(req);
       response.made_by = req.body.made_by;
       console.log(response);
       return res.status(response.status).json( response);
   }else{
    return  res.status(400).json({message: messages.VERIFICATION.MISSING_NUMBER});
   }
   
}

