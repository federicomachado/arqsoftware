const config = require("../config.json")
const User = require("./user.model");
const messages = require("../messages.json");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const moment = require("moment");


exports.create_user = async function ( res, data ){            
    var query = { "username" : data.username };
    let password_hashed = bcrypt.hashSync(data.password, 10);
    var user =  {
        username : data.username,
        password : password_hashed,
        email : data.email    
    }
    options = { upsert: true, new: true, setDefaultsOnInsert: true };    
    User.findOneAndUpdate(query, user, options, function(error, result) {
        if (error) return res.status(400).json({message: error});
        return res.status(200).json({message: messages.USER.CREATE_SUCCESS});
    });    
}

exports.verify_password = async function (username,password){    
    var user = await User.findOne({ username: username});  
    return {user: user, valid : user && bcrypt.compareSync(password,user.password)};    
    
}

exports.verify_admin = async function (username, password){
    return username == config.admin_username && password == config.admin_password
}

exports.generate_token = async function (user){    
    var token = await crypto.randomBytes(64).toString('hex');
    user.token = token;
    user.token_expires = moment().add(5,"minutes");
    user.save();    
    return token;     
}

exports.verify_token = async function (token){
    var user = await User.findOne({token : token});        
    if (user){        
        if (user.token_expires > moment()){
            user.token_expires = moment().add(5,"minutes");
            user.save();
            return ({ valid: true, message: messages.USER.LOGIN_SUCCESS});
        }else{
            return ({ valid: false, message: messages.USER.LOGIN_TOKEN_EXPIRED, status:401});
        }
        
    } else{
        return ({ valid:false, message: messages.USER.LOGIN_INVALID_TOKEN, status:400});
    }
    
}
