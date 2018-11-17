
const CreditCardCreationController = require('./creditCardCreation/creditCardCreation.controller');
var appRouter = function (app) {
    app.post("/creditCard", function (req, res) {   
        console.log("create credit card");  
        console.log("body",req.body);  
        var objResp = CreditCardCreationController.createCreditCard(req.body);        
        if(objResp.error){
            res.status(400).send();
        }else{
            //res.status(201).send(objResp.paymentSaved);
            res.status(201);
        }  
           
    }); 
}

module.exports = appRouter; 
