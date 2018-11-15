const Purchase = require('../models/purchase.model');
const GatewayEntry = require("../models/gatewayEntry.model");
const superagent = require("superagent");
const config = require("./../config")

exports.purchase_create = function (req,res){     
    // @TODO: Metodo para verificar el formato del request
    if (true){
        GatewayEntry.findOne({category: req.body.product.category}, function(err,selectedGateway){            
            if (selectedGateway){            
                req.body.gateway_name = selectedGateway.name
                credit_card_info = req.body.credit_card;
                                                  
                superagent.post(config.tepagoya_url+"/api/consume").send({provider : selectedGateway.name, operation: "purchase", params : credit_card_info }).end(function(err,resp){
                    if (err){
                        res.status(500).json({error : err});
                        }            
                    else{
                        consumer_purchase = new Purchase(req.body);                                                                 
                        consumer_purchase.transaction_code = resp.body.transaction_code;
                        consumer_purchase.save();
                        res.status(200).json({ purchase_status: "success",transaction_code : resp.body.transaction_code});
                        }
                });                                                  
            }else{
                res.status(400).json({error: "Gateway not found for category "  + req.body.product.category});
            }    
        });
        
    }else{
        res.status(400).json({error : "Invalid format"});    
    }
}

exports.gateway_create = function (req,res){  
    // @TODO: Metodo para verificar el formato del request     
    if (true){
        var query = { "category" : req.body.category};
        update = { name : req.body.name, category: req.body.category },
        options = { upsert: true, new: true, setDefaultsOnInsert: true };
        GatewayEntry.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) return;
            res.status(200).json({message:"Gateway created successfully"});
        });
    }
    else{
        return res.status(400).json({error: "Invalid format"});
    }        
}            



