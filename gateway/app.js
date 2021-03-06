var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const routes = require("./verification/verification.routes");
const notifyRoutes = require("./notify/notify.routes");
const batchRoutes = require("./batch/batch.routes");
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
    app.use("/",routes);
    app.use("/",notifyRoutes);
    app.use("/",batchRoutes);
    return app;    
}