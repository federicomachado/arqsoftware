const CreateTransactionController = require('./createTransaction.controller');

var appRouter =  function (app) {
    var stLogTitle = "appRouter";
    try{
        app.post("/transaction", async function (req, res) {      
            var objResp = await CreateTransactionController.createTransaction(req.body);   
            console.log("objResp route", objResp);     
            if(objResp.error){
                console.log("err");
                res.status(400).send(objResp);
            }else{
                res.status(201).send(objResp);
                console.log("success");         
            }  
               
        });

    }catch(error){
        console.log(stLogTitle,error);
    }
}

module.exports = appRouter; 