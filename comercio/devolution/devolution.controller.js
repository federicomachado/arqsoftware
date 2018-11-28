const Service = require('./devolution.service');

async function createDevolution(body,res){    
      return await Service.createDevolution(body,res);      
 }

 module.exports = {createDevolution};