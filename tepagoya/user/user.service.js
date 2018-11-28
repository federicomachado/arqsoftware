const config = require("../config.json")
const User = require("./user.model");
const messages = require("../messages.json");
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const moment = require("moment");
const Log = require("../logs/"+config.log_service+".service");


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
            return ({ valid: true, message: messages.USER.LOGIN_SUCCESS});
        }else{
            return ({ valid: false, message: messages.USER.LOGIN_TOKEN_EXPIRED, status:401});
        }
        
    } else{
        return ({ valid:false, message: messages.USER.LOGIN_INVALID_TOKEN, status:400});
    }
    
}

exports.user_signup = async function (req,res){
    if (req.body.auth_data && req.body.auth_data.username && req.body.auth_data.password){        
        if (req.body.user_data && req.body.user_data.username && req.body.user_data.password){ 
            var isAdmin = await this.verify_admin(req.body.auth_data.username,req.body.auth_data.password);
            if (isAdmin){
                return this.create_user(res,req.body.user_data);                
            } else{                
                Log.log(messages.USER.BAD_AUTH_DATA,req.body);
                return res.status(400).json({error : messages.USER.BAD_AUTH_DATA});
            }
        } else{
            Log.log(messages.USER.MISSING_FIELDS,req.body);
            return res.status(400).json({error : messages.USER.MISSING_FIELDS});
        }
    } else{
        Log.log(messages.USER.NO_AUTH_DATA,req.body);
        return res.status(400).json({error : messages.USER.NO_AUTH_DATA});
    }
}

exports.user_login = async function (req,res){    
    if (req.body.username && req.body.password){                
        let verify = await this.verify_password(req.body.username,req.body.password);
        if (verify.valid){
            let token = await this.generate_token(verify.user);
            return res.status(200).json({ token : token, message : messages.USER.LOGIN_SUCCESS});
        }else{
            Log.log(messages.USER.BAD_LOGIN,req.body);
            return res.status(400).json({error : messages.USER.BAD_LOGIN});
        }
    } else{
        Log.log(messages.USER.NO_LOGIN_DATA,req.body);
        return res.status(400).json({error : messages.USER.NO_LOGIN_DATA});
    }

}