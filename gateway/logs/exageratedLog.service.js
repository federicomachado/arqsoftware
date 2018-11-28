const config = require("../config.json");
const Log = require(config.log_dependency);
var moment = require("moment");

exports.log = function(message,rd){
    if (rd.original_params){
        rd.original_params.number = undefined;
        rd.original_params.security_code = undefined;        
    }
    Log.create_entry(moment(),message+"!!!!!!!!!!!!!!!!!!!",JSON.stringify(rd));    
}

exports.initDatabase = function(db,db_name){
    Log.initDatabase(db,db_name);
}