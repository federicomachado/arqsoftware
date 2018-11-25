const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

let creditCardSchema = new Schema ({
    id: mongoose.Schema.Types.ObjectId,
    customerName: {type: String, required: true, max: 100},
    accountNumberPlusDigit: {type: String, required: true, max: 100},
    binNumber: {type : Schema.Types.ObjectId,
                ref : 'bin'
    },
    expires: { type: String,required: true},
    currentAmount: { type: Number, required: true},
    limitAmount: { type: Number, required: true},
    status: {type: String, required: true, enum: ['Blocked', 'Denounced','Active']} 
});
module.exports = mongoose.model('Creditcard', creditCardSchema);