var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const verificationRoutes = require("./verification/verification.route");
const thresholdRoutes = require("./threshold/threshold.route");
const config = require("./config.json");
const Log = require("./logs/"+config.log_service+".service");


initDatabase();
app = initApp();

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
    app.use("/",verificationRoutes);
    app.use("/",thresholdRoutes);
    return app;    
}