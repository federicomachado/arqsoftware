const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const config = require("../config.json");

let UserSchema = new Schema({        
    username : { type:String, required:true},
    password : { type:String, required:true },
    email : { type: String, required:false},
    token : { type: String, required: false},
    token_expires : { type: Date, required:false},
    role : { type:String, default : 'user'}
    
});

const db = mongoose.connection.useDb(config.database_name);
module.exports = mongoose.model('User', UserSchema);