const config = require("../config")
const messages = require("../utils/messages.json");
const GatewayEntry = require("./gateway.model");

exports.gateway_create = async function (res, name, category){
    var query = { "category" : category};
    update = { name : name, category: category },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    GatewayEntry.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return res.status(400).json({message: error});
        return res.status(200).json({message: messages.GATEWAY.CREATE_SUCCESS});
    });
}