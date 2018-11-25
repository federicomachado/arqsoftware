
const ProviderService = require("../serviceProvider/serviceProvider.service");
const superagent = require("superagent");
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");

exports.consume = async function (req,res){       
    console.log("Request received successfully");     
    provider = await ProviderService.validateRequest(req.body.provider, req.body.operation, req.body.params, req.body.made_by);
    if (provider.valid){                
        continue_flow = true; 
        while (continue_flow){        
                return_message = undefined;                                    
                operation_url = provider.operation_url ? provider.url + "/" + provider.operation_url : provider.url;                
                console.log("Sending request to: " + operation_url);  
                console.log(provider);                     
                let resp_1 = await superagent.post(operation_url).send({ operation : provider.operation, params : provider.params, made_by :  req.body.made_by}).catch(
                    err => { return_message = err }
                );                
                if (resp_1 && resp_1.body){                    
                    provider_name = resp_1.body.provider;                    
                    if (resp_1.body.provider == req.body.made_by){                          
                        return res.status(200).json(resp_1.body);                                        
                    }else{
                        provider = await ProviderService.validateRequest(resp_1.body.provider, resp_1.body.operation, resp_1.body.params, resp_1.body.made_by);                                                                           
                        if (!provider.valid){
                            Log.log(provider.message, { original_provider: resp_1.body.provider, original_operation: resp_1.body.operation, original_params : resp_1.body.params, made_by : resp_1.made_by});
                            return  res.status(400).json({message : provider.message});
                        }
                        continue_flow = provider.valid;
                    }
                } else{                         
                    if (return_message && return_message.response && return_message.response.body && return_message.response.body.message){
                        Log.log(return_message.response.body.message  + ", From url " + operation_url, { original_provider : req.body.provider, original_operation : req.body.operation, made_by : req.body.made_by }  );
                        return  res.status(400).json({message : return_message.response.body.message  + ", From url "  + operation_url});
                    }else{
                        Log.log("Received empty response from url" + operation_url, { original_provider : req.body.provider, original_operation : req.body.operation, made_by : req.body.made_by }  );
                        return  res.status(400).json({message : "Received empty response from url" + operation_url});
                    }
                }
        }                        
    } else{
        Log.log(provider.message, { original_provider: req.body.provider, original_operation: req.body.operation, original_params : req.body.params, made_by :req.body.made_by});
        return  res.status(400).json({message : provider.message});
    }
}
