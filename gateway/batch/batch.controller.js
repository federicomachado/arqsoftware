const BatchService = require('./batch.service');

exports.getBatchInfo = async function(req,res){    
    console.log("Gateway Received Request");  
    let transactions = await BatchService.getBatches(req,res);    
    console.log(transactions);
 }

