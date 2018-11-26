const ChargebackController = require('./chargeback.controller');

var appRouter = function (app) {
    app.post("/chargeback", async function (req, res) {   
        console.log("create chargeback");  
        console.log("body",req.body);  
        var objResp = await ChargebackController.createChargeback(req.body);        
        if(objResp.error){
            return res.status(400).send(objResp);
        }else{
            return res.status(201).send(objResp);
        }  
           
    }); 
}

module.exports = appRouter; 