const BatchService = require('./batch.service');

exports.getBatchInfo = async function(req,res){    
    return BatchService.getBatches(req,res);        
 }

