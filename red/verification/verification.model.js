const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({
    name: {type: String, required: true, max: 100},
    number: {type: String, required: true, max: 100},
    date: { type:Date, required:true}    
});

let TresholdSchema = new Schema({
    limit: {type: Number, required: true},    
    date: { type:Date, required:true}    
});

module.exports = mongoose.model('Transaction', TransactionSchema);
module.exports = mongoose.model('Treshold', TresholdSchema);

