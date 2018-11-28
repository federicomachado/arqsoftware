const CreditCardCreationController = require('./createCreditCard.controller');
const middleware = require("../utils/token.middleware");

var appRouter = function (app) {
    app.post("/creditCard", middleware.key, function (req, res) {   
        var objResp = CreditCardCreationController.createCreditCard(req.body);                
        res.status(201).send(objResp.creditCardSaved);           
    });
}

module.exports = appRouter; 
