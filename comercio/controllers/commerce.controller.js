const Purchase = require('./../../core/models/purchase.model');
const GatewayEntry = require("../models/gatewayEntry.model");
const superagent = require("superagent");
const config = require("./../config")

exports.purchase_create = function (req,res){     
    // Metodo para verificar el formato del request, TO DO
    if (true){
        const selectedGateway = GatewayEntry.find({category: req.body.category});
        if (selectedGateway){
            consumer_purchase = new Purchase(req.body);
            consumer_purchase = consumer_purchase.save(function (err){
                if (err) {
                   res.status(500).json({error: "There has been an error completing the purchase" });
                } else{
                    console.log("Purchase created");
                    superagent.post(config.url).send({purchase:consumer_purchase, gateway_url : selectedGateway.url}).end(function(err,res){
                        if (err){
                            res.status(500).json({error : err});
                        }            
                        else{
                            res.status(200).json({ purchase_code : consumer_purchase._id});
                            }
                    });        
                }
            });
            
        }else{
            res.status(400).json({error: "Gateway not found"});
        }
    }else{
    res.status(400).json({error : "Invalid format"});    
    }
}

exports.gateway_create = function (req,res){    

    // Método para verificar el formato del request, TO DO.
    if (true){
        var query = { "category" : req.body.category},
        update = { url : req.body.url, category: req.body.category },
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



