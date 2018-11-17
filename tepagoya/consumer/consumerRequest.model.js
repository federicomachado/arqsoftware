const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ConsumerRequestSchema = new Schema({        
    provider : { type:String, required: true },
    operation : { type:String, required:true },
    made_by : { type: String, required: true}        
});

module.exports = mongoose.model('ConsumerRequest', ConsumerRequestSchema);