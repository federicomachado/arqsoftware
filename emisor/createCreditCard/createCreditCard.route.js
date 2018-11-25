const CreditCardCreationController = require('./createCreditCard.controller');
const middleware = require("../utils/token.middleware");

var appRouter = function (app) {
    app.post("/creditCard", function (req, res) {   
        //console.log("create credit card");  
        //console.log("body",req.body);  
        var objResp = CreditCardCreationController.createCreditCard(req.body);        
        if(objResp.error){
            console.log("err");
            res.status(400).send(objResp.errorDetail);
        }else{
            res.status(201).send(objResp.creditCardSaved);
            console.log("success");         
        }  
           
    });
}

module.exports = appRouter; 