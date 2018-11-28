const Transaction = require("../transaction/transaction.model");
const moment = require("moment");
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;
const client = redis.createClient(REDIS_PORT);

exports.cache = async function(req,res,next){        
    client.get(req.body.params.name,function(err,data) {
        if (err) { 
            next()
        }else{
            if (data!=null){            
                batches = data;
               res.send(JSON.parse(batches)).end();               
            }else{
                next();
            }
        }
    });
        
}

exports.getBatches = async function (req,res){    
    params = req.body.params;    
    let date = moment(params.date).format("LL");    
    let lower_range = moment(date,"LL");
    let hours = 24 - params.closing_hour;
    let upper_range = moment(date,"LL").add(1,"days").subtract( hours,"hours");   
    let transactions = await Transaction.aggregate([
        {
            "$match" : { 
                "transaction_date" : { "$gt": new Date(lower_range.valueOf()) ,
                                        "$lt" : new Date(upper_range.valueOf())  },
                "transaction_origin" : { "$eq": params.name  }
            }
        }
    ]);     
    if (transactions.length > 0  ){
        client.setex(transactions[0].transaction_origin,60*60*23, JSON.stringify(transactions));
    }
    return res.status(200).json(transactions);
    
}