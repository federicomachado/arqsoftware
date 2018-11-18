const TransactionModel = require('./createTransaction.model');
var luhn = require("luhn");

var moment = require("moment");
async function createTransaction(bodyAnswer){

   // if(!luhn.validate(bodyAnswer.creditCard.numberCreditCard)){
      // console.log("no cumple con algoritomo de Luhn");
    //}
    console.log("bodyAnswer: "+ JSON.stringify(bodyAnswer));
    var creditCardFound = await TransactionModel.findCreditCard(bodyAnswer);
    console.log("resp 33333: "+  JSON.stringify(creditCardFound));
    if(creditCardFound != null && creditCardFound!= "" && Object.keys(creditCardFound).length != 0){
        console.log("enter enter enter");     
        var dateToValidate = new Date(bodyAnswer.creditCard.expires);
        console.log("dateToValidate: "+ dateToValidate);
        var expireDate = new Date(creditCardFound.expires);
        console.log("expireDate: "+ expireDate);
        var todayDate = new Date();       
  
        if(todayDate < expireDate){
            console.log("tarjeta vencida");
        }
        if(parseFloat(creditCardFound.currentAmount) < parseFloat(bodyAnswer.transaction.amount)){
            console.log("El saldo de la cuenta del titular no es suficiente para el monto a aprobar.");
        }
        if(creditCardFound.blockedState.isBlocked){
            console.log("Tarjeta Bloqueada");
        }  
        
        console.log("todo bien");
        var newTransaction = bodyAnswer.transaction;
        newTransaction.date = new Date();
        newTransaction.status = "Complete";

        creditCardFound.transactions.push(newTransaction);

        return TransactionModel.createTransaction(creditCardFound);
    }
}
module.exports = {createTransaction}; 