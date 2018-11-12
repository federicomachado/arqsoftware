const Purchase = require('./../../core/models/purchase.model');
const request = require('superagent');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.purchase_create = function (req,res){    
    res.send(req.body);
}