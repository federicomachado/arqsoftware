const Service = require('./createTransaction.service');

async function createTransaction(body,res){ 
   var stLogTitle = "createTransaction - Controller";
   try{
      var respService = await Service.createTransaction(body,res);
      return respService;

   }catch(error){
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createTransaction};