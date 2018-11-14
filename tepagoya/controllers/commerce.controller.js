const Purchase = require('./../../core/models/purchase.model');
const request = require('superagent');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.purchase_create = function (req,res){   
    console.log("Received transaction from Commerce");
    console.log(req.body); 
    res.send(req.body);
}