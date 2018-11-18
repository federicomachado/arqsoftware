const superagent = require("superagent");
const config = require("./../config.json");
const VerificationService = require("./verification.service");

exports.card_verify = async function (req,res){    
        
}

exports.set_treshold = async function (req,res){    
    if (req.body.limit){
        var response = await VerificationService.setTreshold(req.body.limit);
        return res.status(response.status).json(response.message);
    }
    return res.status(400).json({message: "Limit parameter needed"});
}