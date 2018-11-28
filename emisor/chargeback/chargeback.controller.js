const Service = require('./chargeback.service');
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");

async function createChargeback(body,res){ 
   var stLogTitle = "createChargeback - Controller";
   try{
      var respService = await Service.createChargeback(body,res);
      return respService;

   }catch(error){
    Log.log(stLogTitle,{error});
      console.log(stLogTitle,error);
   }
   
 }

 module.exports = {createChargeback};