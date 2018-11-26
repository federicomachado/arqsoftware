const DevolutionController = require('./devolution.controller');
const middleware = require("../utils/token.middleware");


var appRouter = function (app) {
    app.post("/devolution", async function (req, res) {     
        var objResp = await DevolutionController.createDevolution(req.body);        
        if(objResp.error){
            return res.status(400).send(objResp);
        }else{
            return res.status(201).send(objResp);
        }  
           
    }); 
}

module.exports = appRouter; 