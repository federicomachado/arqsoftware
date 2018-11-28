
const Service = require("./serviceProvider.service");

exports.register_provider = function (req,res){
    return Service.register_provider(req,res);
}