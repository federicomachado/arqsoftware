const mongoose = require("mongoose");
const Entry = require("./entry");

let databaseName = "";

exports.initDatabase = function(database, databaseNameC){
    const logDB = mongoose.connect(database, { useNewUrlParser:true});
    databaseName = databaseNameC;
    mongoose.Promise = global.Promise;    
}

exports.create_entry = function(ts, msg, cod){
    let entry = new Entry({
        timestamp: ts,
        message: msg,
        code : cod
    })
    entry.save();
}
