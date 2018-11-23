const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const index = require("./index")

let LogEntry= new Schema({        
    timestamp : { type:Date, required: true },
    message : { type:String, required:true },
    raw_data : { type: String, required: false}        
});

const db = mongoose.connection.useDb(index.databaseName);
module.exports = db.model('LogEntry', LogEntry);