const superagent = require("superagent");
const config = require("../config.json");
const Gateway = require("../gateway/gateway.model");
const moment = require("moment");
const messages = require("../utils/messages.json");

exports.askMovements = async function (req,res) {
    let category = req.body.category;
    if (category){
        let gateway = await Gateway.findOne({ category : category});
        if (gateway){
            let provider = gateway.name;
            info = {
                name : config.provider_name,
                date : moment(),
                closing_hour : config.batch_closing_hour
            }
            let authorization = res.getHeaders()["authorization"];
            superagent.post(config.tepagoya_url).send({provider : provider, operation : "batch", params : info, made_by : config.provider_name })
            .set("authorization",authorization)
            .end(function(err,resp){
                if (err){
                    return res.status(500).json({message:err});
                }else{
                    return res.status(200).json(resp.body);
                }

            });
        } else{
            return res.status(400).json({message: messages.CATEGORY_NOT_FOUND });
        }
    }else{
       return res.status(400).json({message: messages.CATEGORY_NOT_FOUND });
    }
    
}