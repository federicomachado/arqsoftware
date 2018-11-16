const ServiceProvider = require("./serviceProvider.model");
var moment = require("moment");
const config = require("../config.json");
var app = require('express');
var bodyParser = require('body-parser');


exports.validateProvider = async function ( name, operation, params ) {
    console.log("Entered checkProvider for provider " + name );    
    selectedProvider = await ServiceProvider.findOne({provider : name});
    op = selectedProvider.operations.filter(function (o) {         
        return o.name == operation;
    });       
    if (op.length == 0 ){
        return false;
    }
    op = op[0];
    console.log(op.params);
    console.log(" ");
    console.log(params);
    console.log(Object.keys(params));
    console.log(" ");    
    keys = Object.keys(params);    
    if (keys.length == op.params.length){
        for (var i = 0; i < op.params.length; i++) {
            var p = op.params[i].name;
            if (!keys.includes(p)){
                return false;   
            }
            if (op.params[i].type == "Date"){                                                            
                var date = moment( params[op.params[i].name],config.default_date_format,true)                    
                if (!date.isValid()){
                    console.log("La fecha del campo " + op.params[i].name + " No es valida "); 
                    //return false;   
                }
                console.log(date);
                if (op.params[i].format){
                    dateString = date.format(op.params[i].format);

                    console.log("La fecha formateada del campo " + op.params[i].name +  " es: " + dateString);
                }
                

            }
            
        }
    }


    console.log("Se encontró la operación " + op.name );

    return selectedProvider    
};



