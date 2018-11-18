const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let ServiceProviderSchema = new Schema({        
    provider : { type:String, required: true },
    url : { type: String, required : true},
    type : { type: String, required: true},
    operations : [{        
        name : { type: String, required: true},
        params : [{ 
            name : { type:String, required:true},
            type : { type:String, required:true},
            format : { type:String}
        }],
        url : { type: String, default:""}
    }]    
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);