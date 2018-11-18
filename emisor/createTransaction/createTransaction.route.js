const CreateTransactionController = require('./createTransaction.controller');

var appRouter = function (app) {
    app.post("/transaction", function (req, res) {      
        var objResp = CreateTransactionController.createTransaction(req.body);        
        if(objResp.error){
            console.log("err");
            res.status(400).send(objResp.errorDetail);
        }else{
            res.status(201).send(objResp.transactionSaved);
            console.log("success");         
        }  
           
    });
}

module.exports = appRouter; 