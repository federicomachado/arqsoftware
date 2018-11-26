const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let transactionSchema = new Schema({ 
    idTransaction: mongoose.Schema.Types.ObjectId,
    creditCardAcNumber: { type: String, required: true, max: 100},
    date : { type: Date, required: true},
    amount : { type: Number, required: true},   
    status: { type: String, required: true, enum: ['Pending', 'Complete','Error','Canceled','Chargeback']},
    origin: { type: String, required: true, max: 100},
    detail: { type: String, required: true, max: 100},
    contrastedTransaction: {type : Schema.Types.ObjectId,
                          ref : 'transaction'
                         }
});

module.exports = mongoose.model('Transaction', transactionSchema);