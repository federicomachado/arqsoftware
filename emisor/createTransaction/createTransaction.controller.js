const Service = require('./createTransaction.service');
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");

async function createTransaction(body,res){ 
   var stLogTitle = "createTransaction - Controller";
   try{
      var respService = await Service.createTransaction(body,res);
      return respService;
   }catch(error){
     Log.log(stLogTitle,{error});
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createTransaction};