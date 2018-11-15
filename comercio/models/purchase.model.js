const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let PurchaseSchema = new Schema({
    shipping_address : {
        street: {type : String, required: true, max: 100 },
        door_number: { type: String, required: true, max:100},
        city: { type: String, required: true, max:100 },
        country: { type: String, required: true, max: 100},
        postal_code: { type: String,  max: 100}
    },
    billing_address : {
        street: {type : String, required: true, max: 100 },
        door_number: { type: String, required: true, max:100},
        city: { type: String, required: true, max:100 },
        country: { type: String, required: true, max: 100},
        postal_code: { type: String, max: 100}
    },
    amount: { type: Number, required: true},
    date: { type: Date, required:true},
    product: {
        quantity: { type: Number, required: true},
        name: { type: String, required: true},
        category: {type: String, required: true}
    },
    transaction_code : { type: String },
    status : { type: String }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);

