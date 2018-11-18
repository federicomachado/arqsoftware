const mongoose = require('mongoose');
const EmisorSchema = mongoose.Schema;

let CreditCardSchema = new EmisorSchema({
    id: mongoose.Schema.Types.ObjectId,
    customerName: {type: String, required: true, max: 100},
    number: {type: String, required: true, max: 100},
    expires: { type: Date,required: true},
    security_code: { type: String, required: true, max: 100}, 
    currentAmount: { type: Number, required: true},
    limitAmount: { type: Number, required: true},
    blockedState: {
        isBlocked: { type: Boolean, required: true},
        reason: { type: String, max: 100}
    },
    transactions: [{ 
        idTransaction: mongoose.Schema.Types.ObjectId,
        date : { type: Date, required: true},
        amount : { type: Number, required: true},   
        status: { type: String, required: true, enum: ['Pending', 'Complete','Error','Canceled','Chargeback']},
        origin: { type: String, required: true, max: 100}
    }]
});

module.exports = mongoose.model('CreditCardEmisor', CreditCardSchema);