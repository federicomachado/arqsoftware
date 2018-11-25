const config = require("../config.json")
const User = require("./user.model");
const messages = require("../messages.json");
const bcrypt = require('bcrypt');


exports.create_user = async function ( req ){            
    var query = { "username" : data.username };
    let password_hashed = bcrypt.hashSync(data.password, 10);
    var user =  {
        username : req.username,
        password : password_hashed,
        email : req.email    
    }
    options = { upsert: true, new: true, setDefaultsOnInsert: true };    
    User.findOneAndUpdate(query, update, options, function(error, result) {
        if (error) return res.status(400).json({message: error});
        return res.status(200).json({message: messages.USER.CREATE_SUCCESS});
    });    
}

exports.verify_password = async function (username,password){
    var user = await User.find({ username: username});
    console.log(user);
}

exports.verify_admin = async function (username, password){
    return username == config.admin_username && password == config.admin_password
}