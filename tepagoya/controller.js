
const ProviderService = require("./providers/provider.service");
const ServiceProvider = require("./providers/serviceProvider.model");
const request = require('superagent');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.consume= async function (req,res){       
    console.log("Request received successfully"); 
    console.log("Checking if provider " + req.body.provider + " exists in database");
    provider = await ProviderService.validateProvider(req.body.provider, req.body.operation, req.body.params);
    console.log("Returning to consume method");    


    

    res.status(200).json({transaction_code : "ABCDEFGH"});
}

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