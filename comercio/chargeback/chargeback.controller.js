const Service = require('./chargeback.service');

async function createChargeback(body,res){ 
   var stLogTitle = "createChargeback - Controller";
   try{
      var respService = await Service.createChargeback(body,res);
      return respService;
   }catch(error){
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createChargeback};