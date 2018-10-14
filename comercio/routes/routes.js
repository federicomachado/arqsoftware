var faker = require("faker");


var appRouter = function (app) {
        
    app.post("/creditcard", function (req, res) {

        // Verificar que el formato del JSON es correcto                
        return res.json(req.body).status(201);        
    });

    app.get("/", function(req,res){
        return res.status(200);
    })

  }
  
  module.exports = appRouter;