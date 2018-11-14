const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ServiceProviderSchema = new Schema({        
    name : { type:String, required: true },
    url : { type: String, required : true},
    entry_type : { type: String, required: true},
    communication_type : { type:String, required:true},
    additional_data : { type:String, required:true}
});

module.exports = mongoose.model('ServiceProvider', ServiceProviderSchema);