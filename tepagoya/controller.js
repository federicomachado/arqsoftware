
const ProviderService = require("./providers/provider.service");
const ServiceProvider = require("./providers/serviceProvider.model");
const superagent = require("superagent");
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.consume = async function (req,res){       
    console.log("Request received successfully");     
    provider = await ProviderService.validateRequest(req.body.provider, req.body.operation, req.body.params, req.body.made_by);
    if (provider.valid){        
        console.log(provider);
        continue_flow = true; 
        while (continue_flow){                            
                console.log("Sending request to " + provider.url);
                let resp_1 = await superagent.post(provider.url).send({ operation : provider.operation, params : provider.params, made_by :  req.body.made_by}).catch(
                    err => { console.log(err);
                        console.log("Ha ocurrido un error...");
                    }
                )                
                err = false;
                if (err){                        
                        return status(400).json({message : resp_1.body.message});
                }                                      
                if (resp_1.body.provider == req.body.made_by){                    
                    return res.status(200).json(resp_1.body);                                        
                }else{
                    provider = await ProviderService.validateRequest(resp_1.body.provider, resp_1.body.operation, resp_1.body.params, resp_1.body.made_by);                                                                        
                }
        }                        
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