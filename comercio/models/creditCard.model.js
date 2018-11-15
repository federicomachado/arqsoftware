const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CreditCardSchema = new Schema({
    name: {type: String, required: true, max: 100},
    number: {type: String, required: true, max: 100},
    expires: { type: Date, required: true},
    security_code: { type: String, required: true}
});

module.exports = mongoose.model('CreditCard', CreditCardSchema);

