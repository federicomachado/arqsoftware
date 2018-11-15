
const ServiceProvider = require("../models/serviceProvider");
const request = require('superagent');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.consume= function (req,res){   
    console.log("Request received successfully");    
    res.status(200).json({transaction_code : "ABCDEFGH"});
}

exports.register_provider = function (req,res){
    serviceProvider = new ServiceProvider(req.body);

}