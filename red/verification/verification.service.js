const Treshold = require("./verification.model");



exports.validatePurchase = function(){

}

exports.isFraud = function( number ){

}

exports.setTreshold = function ( limit ){
    console.log(limit);    
    return {status: 200, message: "Limit changed to " + limit};
}