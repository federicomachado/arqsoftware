const Transaction = require("../transaction/transaction.model");
const moment = require("moment");

exports.getBatches = async function (req,res){
    console.log("Entered getBatches");
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
                "transaction_origin" : { "$eq": params.name  },
                "status" : { "$eq" : "Confirmed" }
            }
        }
    ]); 
    
    return transactions;
    
}