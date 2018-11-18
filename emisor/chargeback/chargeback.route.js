const ChargeBackController = require('./chargeback.controller');

var appRouter = function (app) {
    app.post("/chargeback", function (req, res) {   
        console.log("create chargeback");  
        console.log("body",req.body);  
        var objResp = ChargeBackController.notifyChargeback(req.body);        
        if(objResp.error){
            res.status(400).send();
        }else{
            //res.status(201).send(objResp.paymentSaved);
            res.status(201);
        }  
           
    }); 
}

module.exports = appRouter; 