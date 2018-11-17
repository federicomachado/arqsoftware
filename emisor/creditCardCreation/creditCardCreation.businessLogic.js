
const CreditCardModel = require('../creditCardCreation/creditCardCreation.model');


function createCreditCard(bodyAnswer){
    var aCreditCard = createCreditCardEntity(bodyAnswer);
    return CreditCardModel.createCreditCard(aCreditCard);
}

function createCreditCardEntity(body){
    const creditCard = new CreditCard({
        customerName: body.customerName,
        number: body.customerName,
        expires: body.expires,
        security_code: body.security_code, 
        currentAmount: body.currentAmount,
        limitAmount: body.limitAmount,
        blockedState: {
            isBlocked: body.blockedState.isBlocked,
            reason: body.blockedState.reason
        },
        denouncedState:{
            denounced:  body.denouncedState.denounced,
            reason: body.denouncedState.reason
        },
        transactions: body.transactions       
    });
}
module.exports = {createCreditCard}; 
