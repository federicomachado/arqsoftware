const Threshold = require("./threshold.model");
const config = require("../config.json");
const messages = require("../messages.json");
const Log = require("../logs/"+config.log_service+".service");

exports.verifyIP = async function ( ip ) {
    // Habria que ver como hacemos estas cosas con Proxy y demás.
    return config.threshold_whitelist.includes(ip);
}


exports.setTreshold = async function ( limit ){         
    var query = { "reference" : 1};
    update = { limit : limit, date: new Date() },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var threshold = await Threshold.findOneAndUpdate(query, update, options, function(error, result) {
        if (error){
            Log.log(messages.THRESHOLD.SAVING_ERROR + limit,{});
            return {status:500, message : messages.THRESHOLD.SAVING_ERROR + limit};   
        }        
    });  
    return {status: 200, message: messages.THRESHOLD.LIMIT_SUCCESS + limit};  
}

exports.set_threshold = async function (req,res){
    if (req.body.limit && this.verifyIP(req.connection.remoteAddress)){
        var response = await this.setTreshold(req.body.limit);
        return res.status(response.status).json({"message" : response.message});
    }
    Log.log(messages.THRESHOLD.LIMIT_NOT_FOUND,req.body);
    return res.status(400).json({message: messages.THRESHOLD.LIMIT_NOT_FOUND});
}