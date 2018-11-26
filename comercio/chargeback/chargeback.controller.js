const Service = require('./chargeback.service');

async function createChargeback(body){ 
   var stLogTitle = "createChargeback - Controller";
   try{
      var respService = await Service.createChargeback(body);
      return respService;

   }catch(error){
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createChargeback};