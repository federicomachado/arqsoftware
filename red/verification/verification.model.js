const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({    
    number: {type: String, required: true, max: 100},
    date: { type:Date, required:true}    
});


module.exports = mongoose.model('Transaction', TransactionSchema);


