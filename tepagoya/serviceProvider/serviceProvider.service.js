const ServiceProvider = require("./serviceProvider.model");
var moment = require("moment");
const config = require("../config.json");
var bodyParser = require('body-parser');
const Log = require("../logs/"+config.log_service+".service");
const bcrypt = require("bcrypt");


exports.validateRequest = async function ( name, operation, params, made_by ) {
    selectedProvider = await ServiceProvider.findOne({provider : name});
    key = selectedProvider.key;
    if (!selectedProvider){     
        console.log( "Provider " + name + " does not exist");
        Log.log("Provider " + name + " does not exist",params);
        return { message : "Provider " + name + " does not exist", valid: false};
    }
    op = selectedProvider.operations.filter(function (o) {         
        return o.name == operation;
    });       
    if (op.length == 0 ){        
        Log.log( "Provider " + name + " does not have " + operation +" operation registered",params);
        return { message: "Provider " + name + " does not have " + operation +" operation registered", valid : false };
    }
    op = op[0];    
    keys = Object.keys(params);        
    for (var i = 0; i < op.params.length; i++) {
        var p = op.params[i].name;
        if (!keys.includes(p)){            
            Log.log( "Required parameter " + p + " does not exist in request ",params);
            return {message: "Required parameter " + p + " does not exist in request ", valid : false};   
        }
        if (op.params[i].type == "Date"){                                                            
            var date = moment( params[op.params[i].name],config.default_date_format,true);    
            var destinationDate = moment( params[op.params[i].name],op.params[i].format,true);              
            if ( !date.isValid() && !destinationDate.isValid()){                      
                Log.log( "Date format of field " + op.params[i].name + " does not comply with TePagoYa default date format " ,params);              
                return {message: "Date format of field " + op.params[i].name + " does not comply with TePagoYa default date format " + config.default_date_format, valid: false};                    
            }                
            if (op.params[i].format){
                if (!destinationDate.isValid() && date.isValid()){
                    dateString = date.format(op.params[i].format);  
                } else{
                    if (destinationDate.isValid() && !date.isValid()){
                        dateString = destinationDate.format(op.params[i].format);  
                    }
                }
                params[op.params[i].name] = dateString;                  
            }                
        }
        
    }               
    return { url : selectedProvider.url, operation_url : op.url, params : params, operation : operation, made_by: made_by, valid:true, key : key, provider_name : selectedProvider.provider};
};


exports.register_provider = function (req,res){
    req.body.key =  bcrypt.hashSync(req.body.key, 10);
    serviceProvider = new ServiceProvider(req.body);
    serviceProvider.save(function(err,ok){
        if (err){
            Log.log(err.message,req.body);
            res.status(400).json({error : err.message});
        }else{            
            res.status(200).json({ message : "Provider registered successfully"});   
        }
    });
}
