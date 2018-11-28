const Service = require('./chargeback.service');

async function createChargeback(body,res){ 
  return await Service.createChargeback(body,res);
 }

 module.exports = {createChargeback};