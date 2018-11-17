const ServiceProvider = require("./serviceProvider.model");

exports.register_provider = function (req,res){
    serviceProvider = new ServiceProvider(req.body);
    serviceProvider.save(function(err,ok){
        if (err){
            res.status(400).json({error : err.message});
        }else{
            res.status(200).json({ message : "Provider registered successfully"});   
        }
    });

}