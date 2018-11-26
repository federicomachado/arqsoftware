const ServiceProvider = require("./serviceProvider.model");
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");
const bcrypt = require("bcrypt");

exports.register_provider = function (req,res){
    req.body.key =  bcrypt.hashSync(req.body.key, 10);
    serviceProvider = new ServiceProvider(req.body);
    serviceProvider.save(function(err,ok){
        if (err){
            Log.log(err.message,req.body);
            res.status(400).json({error : err.message});
        }else{            
            res.status(200).json({ message : "Provider registered successfully"});   
        }
    });
}