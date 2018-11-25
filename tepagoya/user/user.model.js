const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let UserSchema = new Schema({        
    username : { type:String, required:true},
    password : { type:String, required:true },
    email : { type: String, required:true},
    token : { type: String, required: false},
    token_expires : { type: Date, required:false}
    
});

module.exports = mongoose.model('User', UserSchema);