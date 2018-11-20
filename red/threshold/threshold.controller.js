const superagent = require("superagent");
const config = require("./../config.json");
const ThresholdService = require("./threshold.service");
const messages = require("./../messages.json");

exports.set_treshold = async function (req,res){   
             
    if (req.body.limit && ThresholdService.verifyIP(req.connection.remoteAddress)){
        var response = await ThresholdService.setTreshold(req.body.limit);
        return res.status(response.status).json({"message" : response.message});
    }
    return res.status(400).json({message: messages.THRESHOLD.LIMIT_NOT_FOUND});
}