var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const creditCardCreationRoutes = require("./createCreditCard/createCreditCard.route");
const chargebackRoutes = require("./chargeback/chargeback.route");
const createTransaction = require("./createTransaction/createTransaction.route");
const config = require("./config.json");

initDatabase();
var app = initApp();
var server = app.listen(config.port, function () {
    console.log("app running on port.", server.address().port);
});

function initDatabase()  {
    mongoose.connect(config.mongo_url, { useNewUrlParser:true});
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

function initApp() {
    var app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    creditCardCreationRoutes(app);
    createTransaction(app);
    return app;    
}