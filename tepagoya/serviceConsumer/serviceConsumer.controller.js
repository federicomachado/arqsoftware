const Service = require("./serviceConsumer.service");
const superagent = require("superagent");


exports.consume = async function (req,res){       
    return Service.consume(req,res);
}
