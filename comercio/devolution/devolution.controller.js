const Service = require('./devolution.service');

async function createDevolution(body,res){ 
   var stLogTitle = "createChargeback - Controller";
   try{
      var respService = await Service.createDevolution(body,res);
      return respService;

   }catch(error){
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createDevolution};