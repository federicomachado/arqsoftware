const BatchService = require('./batch.service');

async function getBatchInfo(req,res){    
    console.log("Entered Batch Request ");
    return  BatchService.askMovements(req,res);         
 }

 module.exports = {createDevolution};