const CreditCardCreationController = require('./creditCardCreation.controller');

var appRouter = function (app) {
    app.post("/creditCard", function (req, res) {   
        console.log("create credit card");  
        console.log("body",req.body);  
        var objResp = CreditCardCreationController.createCreditCard(req.body);        
        if(objResp.error){
            console.log("err");
            res.status(400).send();
        }else{
            res.status(201).send(objResp.creditCardSaved);
            console.log("success");         
        }  
           
    });
}

module.exports = appRouter; 