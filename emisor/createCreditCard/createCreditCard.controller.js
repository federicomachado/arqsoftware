
const Service = require('./createCreditCard.service');

 function createCreditCard(body){     
    return Service.createCreditCard(body);
 }

 module.exports = {createCreditCard};