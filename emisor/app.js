var express = require("express");
var bodyParser = require("body-parser");

const creditCardCreationRoutes = require("./createCreditCard/createCreditCard.route");
const chargebackRoutes = require("./chargeback/chargeback.route");
const createTransaction = require("./createTransaction/createTransaction.route");
const devolution = require("./devolutions/devolution.route");

const mongoose = require('mongoose');
const config = require("./config.json");
const Log = require("./logs/"+config.log_service+".service");

initDatabase();
var app = initApp();
var server = app.listen(config.port, function () {
    console.log("app running on port.", server.address().port);
});

function initDatabase()  {
    
    try{
        Log.initDatabase(config.mongo_url,config.mongo_name);        
        mongoose.connect(config.mongo_url, { useNewUrlParser:true});
        mongoose.Promise = global.Promise;
        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    }catch(error){
        Log.log(stLogTitle,error);
        console.log(stLogTitle,error);
    }
 
}

function initApp() {
    var stLogTitle = "initApp";
    try{
        var app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        creditCardCreationRoutes(app);
        createTransaction(app);
        chargebackRoutes(app);
        app.use("/",devolution);
     
        return app;
    }catch(error){
        Log.log(stLogTitle,error);
        console.log(stLogTitle,error);
    }   
}