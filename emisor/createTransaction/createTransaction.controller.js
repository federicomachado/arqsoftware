const Service = require('./createTransaction.service');

 function createTransaction(body){
     
    return Service.createTransaction(body);
 }

 module.exports = {createTransaction};