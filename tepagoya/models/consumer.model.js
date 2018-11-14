const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ConsumerSchema = new Schema({        
    name : { type:String, required: true },
    url : { type: String, required : true},
    password : { type:String, required: true}
});

module.exports = mongoose.model('Consumer', ServiceProviderSchema);