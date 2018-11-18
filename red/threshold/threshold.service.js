const Threshold = require("./threshold.model");




exports.setTreshold = async function ( limit ){         
    var query = { "reference" : 1};
    update = { limit : limit, date: new Date() },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };
    var threshold = await Threshold.findOneAndUpdate(query, update, options, function(error, result) {
        if (error){
            return {status:500, message : "There has been an error setting limit to " + limit};   
        }        
    });  
    return {status: 200, message: "Limit changed to " + limit};  
}