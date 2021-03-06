const CreateTransactionController = require('./createTransaction.controller');
const middleware = require("../utils/token.middleware");


var appRouter =  function (app) {
    var stLogTitle = "appRouter";
    try{
        app.post("/transaction", middleware.key, async function (req, res) {      
            var objResp = await CreateTransactionController.createTransaction(req.body,res);   
            console.log("objResp route", objResp);  
            // Aca no se loggea porque se va a loggear adentro de crateTransaction   
            if(objResp.error){
                console.log("err");
                return res.status(400).send(objResp);
            }else{
                return res.status(201).send(objResp);
                console.log("success");         
            }  
               
        });

    }catch(error){
        console.log(stLogTitle,error);
    }
}

module.exports = appRouter; 