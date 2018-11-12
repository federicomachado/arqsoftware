const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    username: { type:String, required: true, max:100 },
    password: { type:String, required: true, max:100 },
    email: { type:String, required: true, max:100 },               
    role: { type:String, required: true, max:100 },
    token: { type:String, required: true, max:100 }
});

module.exports = mongoose.model('User', UserSchema);