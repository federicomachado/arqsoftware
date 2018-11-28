const superagent = require("superagent");
const messages = require("../messages.json");
const config = require("../config.json");
const bcrypt = require("bcrypt");
const Transaction = require("../transaction/transaction.model");
const moment = require("moment");

exports.update = async function (req,res){    
    console.log("Entered notify");    
    let query;
    let update;
    req.body.params.transaction_date = moment(req.body.params.transaction_date,"DD-MM-YY HH:mm:ss").format("MM-DD-YY HH:mm:ss");
    if (req.body.params.status == "Confirmed" ){
        query = {
            transaction_date : req.body.params.transaction_date,
            name : req.body.params.name,
        };
        update =  {
            transactionId : req.body.params.transactionId,
            status : req.body.params.status
        }
    } else{
        query = {
            transactionId : req.body.params.transactionId
        };
        update = {
            status: req.body.params.status
        }
    }

    let transaction = await Transaction.find(query);
    
    transaction = transaction[transaction.length-1];
    transaction.status = update.status;
    console.log(transaction);
    if (!transaction.transactionId){
        transaction.transactionId = update.transactionId;
    }
    transaction.save();
    
    return res.status(200).json({ operation: "notify", params : req.body.params, provider : req.body.made_by, made_by : req.body.made_by });    
    
    
}