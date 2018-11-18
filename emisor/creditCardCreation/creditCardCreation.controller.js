
const Service = require('./creditCardCreation.service');

 function createCreditCard(body){
     
    return Service.createCreditCard(body);
 }

 module.exports = {createCreditCard};