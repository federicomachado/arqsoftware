const config = require("../config.json");
const Log = require(config.log_dependency);
var moment = require("moment");

exports.log = function(message,rd){
    if (rd && rd.original_params){
        rd.original_params.number = null;
    }  
    if (rd && rd.params){
        rd.params.number = null;
        rd.params.security_code = null;
        
    }
    Log.create_entry(moment().unix(),message,JSON.stringify(rd));    
}

exports.initDatabase = function(db,db_name){
    Log.initDatabase(db,db_name);
}