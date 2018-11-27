const BatchService = require('./batch.service');

exports.getBatchInfo = async function(req,res){    
    console.log("Entered Batch Request ");
    return await BatchService.askMovements(req,res);         
 }

