const ServiceProvider = require("./serviceProvider.model");
var moment = require("moment");
const config = require("../config.json");
var app = require('express');
var bodyParser = require('body-parser');


exports.validateRequest = async function ( name, operation, params, made_by ) {
    selectedProvider = await ServiceProvider.findOne({provider : name});
    if (!selectedProvider){
        return { message : "Provider " + name + " does not exist", valid: false};
    }
    op = selectedProvider.operations.filter(function (o) {         
        return o.name == operation;
    });       
    if (op.length == 0 ){
        return { message: "Provider " + name + " does not have " + operation +" operation registered", valid : false };
    }
    op = op[0];    
    keys = Object.keys(params);        
    for (var i = 0; i < op.params.length; i++) {
        var p = op.params[i].name;
        if (!keys.includes(p)){
            return {message: "Required parameter " + p + " does not exist in request ", valid : false};   
        }
        if (op.params[i].type == "Date"){                                                            
            var date = moment( params[op.params[i].name],config.default_date_format,true);    
            var destinationDate = moment( params[op.params[i].name],op.params[i].format,true);              
            if ( !date.isValid() && !destinationDate.isValid()){                    
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
    return { url : selectedProvider.url, operation_url : op.url, params : params, operation : operation, made_by: made_by, valid:true};
};



