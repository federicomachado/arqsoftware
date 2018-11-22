const Purchase = require('./purchase.model');
const CreditCard = require('../models/creditCard.model');
const GatewayEntry = require("../gateway/gateway.model");
const config = require("../config")
const superagent = require("superagent");
const messages = require("../messages");

exports.purchase_create = async function(req,res){

    consumer_purchase = new Purchase(req.body);
    consumer_purchase.status = "Pending";
    consumer_purchase.validate(function(err,ok){
        if (err){
            return res.status(400).json({error: err.message});
        }else{
            credit_card = new CreditCard(req.body.credit_card);
            credit_card.validate(function(err,ok){
                if (err){
                    return res.status(400).json({error: err.message});
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
                                    return res.status(500).json({error : err});
                                    }            
                                else{                                
                                    consumer_purchase.status = "Confirmed";
                                    consumer_purchase.transaction_code = resp.body.transaction_code;
                                    consumer_purchase.save();
                                    return res.status(200).json({ purchase_status: "success", message: resp.body.message, transaction_code : resp.body.transactionID});
                                    }
                                });                                                                                                                                    
                        }else{
                            return res.status(400).json({error: messages.PURCHASE.GATEWAY_NOT_FOUND  + req.body.product.category});
                        }    
                    });
                }
            });
        }
    });
}