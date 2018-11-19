const superagent = require("superagent");
const config = require("./../config.json");
const VerificationService = require("./verification.service");

exports.card_verify = async function (req,res){ 
   if (req.body.params.number){
       var response = await VerificationService.validatePurchase(req);
       response.made_by = req.body.made_by;
       res.status(response.status).json( response);
   }else{
    return  res.status(400).json({message: "Missing number field"});
   }
   
}

