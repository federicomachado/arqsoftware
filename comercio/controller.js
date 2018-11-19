const Purchase = require('./models/purchase.model');
const CreditCard = require('./models/creditCard.model');
const GatewayEntry = require("./models/gatewayEntry.model");
const superagent = require("superagent");
const config = require("./config")

exports.purchase_create = function (req,res){      
    // @TODO: Metodo para verificar el formato del request, verificar tarjeta de credito
    consumer_purchase = new Purchase(req.body);
    consumer_purchase.status = "Pending";
    consumer_purchase.validate(function(err,ok){
        if (err){
            res.status(400).json({error: err.message});
        }else{
            credit_card = new CreditCard(req.body.credit_card);
            credit_card.validate(function(err,ok){
                if (err){
                    res.status(400).json({error: err.message});
                }else{
                    GatewayEntry.findOne({category: req.body.product.category}, function(err,selectedGateway){            
                        if (selectedGateway){                                        
                            info = req.body.credit_card;
                            info.transaction_amount = req.body.amount;
                            info.transaction_origin = config.provider_name;
                            info.transaction_detail = req.body.product.name;
                            info.transaction_date = req.body.transaction_date;
                            req.body.status = "Sent";                                           
                            superagent.post(config.tepagoya_url).send({provider : selectedGateway.name, operation: "purchase", params : info, made_by : config.provider_name }).end(function(err,resp){
                                if (err){
                                    res.status(500).json({error : err});
                                    }            
                                else{                                
                                    consumer_purchase.status = "Confirmed";
                                    consumer_purchase.transaction_code = resp.body.transaction_code;
                                    consumer_purchase.save();
                                    res.status(200).json({ purchase_status: "success", message: resp.body.message, transaction_code : resp.body.transaction_code});
                                    }
                                });                                                                                                                                    
                        }else{
                            res.status(400).json({error: "Gateway not found for category "  + req.body.product.category});
                        }    
                    });
                }
            });
        }
    });

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



