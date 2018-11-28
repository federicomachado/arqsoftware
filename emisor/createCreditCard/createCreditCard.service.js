
const CreditCardModel = require('./createCreditCard.model');
const CreditCard = require('../models/creditCard.model');
var moment = require("moment");

function createCreditCard(bodyAnswer){
    var aCreditCard = new CreditCard(bodyAnswer);
    return CreditCardModel.createCreditCard(aCreditCard);
}
module.exports = {createCreditCard}; 
