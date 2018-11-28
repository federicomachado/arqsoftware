const config = require("../config")
const messages = require("../utils/messages.json");
const GatewayEntry = require("./gateway.model");
const Log = require("../logs/"+config.log_service+".service");

exports.gateway_create = async function (res, name, category){
    var query = { "category" : category};
    update = { name : name, category: category },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    GatewayEntry.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) {
            Log.log(error,name);
            return res.status(400).json({message: error})
        };
        return res.status(200).json({message: messages.GATEWAY.CREATE_SUCCESS});
    });
}


exports.gateway_create_cont = async function(req,res) {
    if (req.body && req.body.category && req.body.name){
        return await this.gateway_create(res,req.body.name, req.body.category);    
    }
    else{
        Log.log(messages.GATEWAY.INVALID_FORMAT,req.body);
        return res.status(400).json({error: messages.GATEWAY.INVALID_FORMAT});
    }   
}     