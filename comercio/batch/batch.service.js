const superagent = require("superagent");
const config = require("../config.json");
const Gateway = require("../gateway/gateway.model");
const moment = require("moment");

exports.askMovements = async function (req,res) {
    let category = req.body.category;
    if (category){
        let gateway = await Gateway.findOne({ category : category});
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


        });
        //superagent.post(config.tepagoya_url).send({provider : selectedGateway.name, operation: "purchase", params : info, made_by : config.provider_name }).set("authorization",authorization).end(function(err,resp){
        return res.status(200).json();
    }else{
        // LA CATEGORIA NO EXISTE!!!!
    }
    
}