const superagent = require("superagent");
const config = require("./../config.json");
const ThresholdService = require("./threshold.service");

exports.set_treshold = async function (req,res){    
    if (req.body.limit){
        var response = await ThresholdService.setTreshold(req.body.limit);
        return res.status(response.status).json({"message" : response.message});
    }
    return res.status(400).json({message: "Limit parameter needed"});
}