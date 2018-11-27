const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TransactionSchema = new Schema({    
    name : { type : String, required:true},
    transaction_origin : { type : String, required:true},    
    transaction_amount: { type: Number, required: true},        
    transaction_detail: { type: String, required: true, max: 100},
    transaction_date: { type: Date},
    transactionId: { type:String},
    status: { type:String}
});

module.exports = mongoose.model('Transaction', TransactionSchema);

