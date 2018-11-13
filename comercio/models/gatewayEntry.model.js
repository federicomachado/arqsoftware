const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let GatewayEntrySchema = new Schema({
    category: { type:String, required: true, max:100 },    
    url : { type:String, required: true },
    created_at : { type:Date, required: true}
});

module.exports = mongoose.model('GatewayEntry', GatewayEntrySchema);