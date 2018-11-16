
const ProviderService = require("./providers/provider.service");
const ServiceProvider = require("./providers/serviceProvider.model");
const superagent = require("superagent");
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.consume= async function (req,res){       
    console.log("Request received successfully"); 
    provider = await ProviderService.validateRequest(req.body.provider, req.body.operation, req.body.params);
    if (provider.valid){
        console.log(provider);
        superagent.post(provider.url).send({ operation : provider.operation, params : provider.params}).end(function(err,resp_1){
            console.log("Request sent");
        });
        res.status(200).json({message: "Request OK"});
    }else{
        res.status(400).json({message: provider.message});
    }


    

    //res.status(200).json({transaction_code : "ABCDEFGH"});
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