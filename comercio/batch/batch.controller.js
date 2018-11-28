const BatchService = require('./batch.service');

exports.getBatchInfo = async function(req,res){        
    return await BatchService.askMovements(req,res);         
 }

