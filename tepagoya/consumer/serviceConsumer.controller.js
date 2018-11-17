
const ProviderService = require("../provider/serviceProvider.service");
const superagent = require("superagent");

exports.consume = async function (req,res){       
    console.log("Request received successfully");     
    provider = await ProviderService.validateRequest(req.body.provider, req.body.operation, req.body.params, req.body.made_by);
    if (provider.valid){        
        console.log(provider);
        continue_flow = true; 
        while (continue_flow){                                            
                operation_url = provider.operation.url ? provider.url + "/" + provider.operation.url : provider.url;
                console.log("Sending request to: " + operation_url);
                let resp_1 = await superagent.post(operation_url).send({ operation : provider.operation, params : provider.params, made_by :  req.body.made_by}).catch(
                    err => { return  res.status(400).json({message : err}); }
                )                
                                   
                if (resp_1.body.provider == req.body.made_by){                    
                    return res.status(200).json(resp_1.body);                                        
                }else{
                    provider = await ProviderService.validateRequest(resp_1.body.provider, resp_1.body.operation, resp_1.body.params, resp_1.body.made_by);                                                                        
                }
        }                        
    }else{
        res.status(400).json({message: provider.message});
    }
}
