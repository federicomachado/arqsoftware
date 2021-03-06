var express = require("express");
var bodyParser = require("body-parser");

var gatewayRoutes = require("./gateway/gateway.route");
var purchaseRoutes = require("./purchase/purchase.route");
var chargeBackRoutes = require("./chargeback/chargeback.route");
var devolutionRoutes = require("./devolution/devolution.route");
var batchRoutes = require("./batch/batch.route");

var mongoose = require("mongoose");

const config = require('./config.json');
const Log = require("./logs/"+config.log_service+".service");

initDatabase();

var app = initApp();

var server = app.listen(config.port, function () {
    console.log("app running on port.", server.address().port);
});

function initDatabase()  {
    Log.initDatabase(config.mongo_url,config.mongo_name);
    mongoose.connect(config.mongo_url, { useNewUrlParser:true});
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

function initApp() {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use("/",gatewayRoutes);
    app.use("/",purchaseRoutes);
    app.use("/",chargeBackRoutes);
    app.use("/",devolutionRoutes);
    app.use("/",batchRoutes);
    return app;
    
}
