const Treshold = require("./threshold.model");




exports.setTreshold = function ( limit ){
    console.log(limit);    
    return {status: 200, message: "Limit changed to " + limit};
}