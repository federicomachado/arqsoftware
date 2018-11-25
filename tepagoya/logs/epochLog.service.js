const config = require("../config.json");
const Log = require(config.log_dependency);
var moment = require("moment");

exports.log = function(message,rd){
    console.log(message);
    if (rd.original_params){
        rd.original_params.number = null;
    }  
    Log.create_entry(moment().unix(),message,JSON.stringify(rd));    
}

exports.initDatabase = function(db,db_name){
    Log.initDatabase(db,db_name);
}