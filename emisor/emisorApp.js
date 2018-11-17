var express = require("express");
var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const routes = require("./routes");
const config = require("./config.json");

initDatabase();
app = initApp();
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
    app.use("/api",routes);
    return app;    
}