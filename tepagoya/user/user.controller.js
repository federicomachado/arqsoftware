const UserService = require("./user.service");


exports.user_signup = async function (req,res){    
   return UserService.user_signup(req,res);

}

exports.user_login = async function (req,res){    
    return UserService.user_login(req,res);
}