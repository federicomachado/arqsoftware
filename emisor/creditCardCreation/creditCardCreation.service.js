
const CreditCardModel = require('./creditCardCreation.model');
const CreditCard = require('../models/creditCard.model');


function createCreditCard(bodyAnswer){
    var aCreditCard = new CreditCard(bodyAnswer);  
    return CreditCardModel.createCreditCard(aCreditCard);
}

module.exports = {createCreditCard}; 
