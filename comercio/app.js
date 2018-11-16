var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes.js");
var mongoose = require("mongoose");

const config = require('./config.json');

initDatabase();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/",routes);

var server = app.listen(config.port, function () {
    console.log("app running on port.", server.address().port);
});

function initDatabase()  {
    mongoose.connect(config.mongo_url, { useNewUrlParser:true});
    mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}
