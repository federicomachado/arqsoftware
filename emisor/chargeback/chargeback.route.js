const ChargebackController = require('./chargeback.controller');
const middleware = require("../utils/token.middleware");


var appRouter = function (app) {
    app.post("/chargeback", middleware.auth, middleware.key, async function (req, res) {     
        var objResp = await ChargebackController.createChargeback(req.body,res);        
        if(objResp && objResp.error){
            return res.status(400).send(objResp);
        }else{
            return res.status(201).send(objResp);
        }  
           
    }); 
}
module.exports = appRouter; 