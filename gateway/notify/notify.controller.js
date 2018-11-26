const superagent = require("superagent");
const messages = require("../messages.json");
const config = require("../config.json");
const bcrypt = require("bcrypt");

exports.update = async function (req,res){    
    console.log("Received purchase verify");        
    console.log(req.body);
    return res;
}