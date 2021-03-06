const Purchase = require('../models/purchase.model');
const CreditCard = require('../models/creditCard.model');
const GatewayEntry = require("../gateway/gateway.model");
const config = require("../config")
const superagent = require("superagent");
const messages = require("../utils/messages.json");
const moment = require("moment");
const Log = require("../logs/"+config.log_service+".service");

exports.purchase_create = async function(req,res){       
    consumer_purchase = new Purchase(req.body);    
    
    consumer_purchase.status = "Pending";
    consumer_purchase.validate(function(err,ok){        
        if (err){
            Log.log(err.message,req.body);
            return res.status(400).json({error: err.message});
        }else{    
            credit_card = new CreditCard(req.body.credit_card);
            credit_card.validate(function(err,ok){
                if (err){
                    Log.log(err.message,req.body);
                    return res.status(400).json({error: err.message});
                }else{
                    GatewayEntry.findOne({category: req.body.product.category}, function(err,selectedGateway){            
                        if (selectedGateway){                                        
                            info = req.body.credit_card;
                            info.transaction_amount = req.body.amount;
                            info.transaction_origin = config.provider_name;
                            info.transaction_detail = req.body.product.name;
                            info.transaction_date = moment(req.body.transaction_date,"MM-DD-YY HH:mm:ss").format("DD-MM-YY HH:mm:ss");
                            req.body.status = "Sent";                                                                       
                            var authorization = res.getHeaders()["authorization"];
                            superagent.post(config.tepagoya_url).send({provider : selectedGateway.name, operation: "purchase", params : info, made_by : config.provider_name }).set("authorization",authorization).end(function(err,resp){
                                if (err){
                                    Log.log(err,req.body);
                                    return res.status(500).json({error : err});
                                    }            
                                else{                                
                                        consumer_purchase.status = "Confirmed";
                                        consumer_purchase.transaction_code = resp.body.transactionID;
                                        consumer_purchase.emisor = resp.body.made_by;
                                        consumer_purchase.save();                                        
                                        info = {
                                            status : "Confirmed",
                                            transactionId : resp.body.transactionID,
                                            transaction_date : info.transaction_date,
                                            name : req.body.credit_card.name
                                        }
                                        superagent.post(config.tepagoya_url).send({provider: selectedGateway.name, operation: "notify", params : info, made_by : config.provider_name}).set("authorization",authorization).end(function(err,resp1){
                                            if (err){
                                                Log.log(err,req.body);
                                                return res.status(500).json({error : err});
                                            } else{
                                                return res.status(200).json({ purchase_status: "success", message: resp.body.message, transaction_code : resp.body.transactionID});
                                            }
                                        });                                    
                                    }
                                });                                                                                                                                    
                        }else{
                            Log.log(messages.PURCHASE.GATEWAY_NOT_FOUND  + req.body.product.category,req.body);
                            return res.status(400).json({error: messages.PURCHASE.GATEWAY_NOT_FOUND  + req.body.product.category});
                        }    
                    });
                }
            });
        }
    });
}