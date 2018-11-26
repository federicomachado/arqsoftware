const Service = require('./devolution.service');

async function createDevolution(body){ 
   var stLogTitle = "createChargeback - Controller";
   try{
      var respService = await Service.createDevolution(body);
      return respService;

   }catch(error){
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createDevolution};