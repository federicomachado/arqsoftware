const UserService = require("./user.service");
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");
const messages = require("../messages.json");

exports.user_signup = async function (req,res){    
    if (req.body.auth_data && req.body.auth_data.username && req.body.auth_data.password){        
        if (req.body.user_data && req.body.user_data.username && req.body.user_data.password && req.body.user_data.email){ 
            var isAdmin = await UserService.verify_admin(req.body.auth_data.username,req.body.auth_data.password);
            if (isAdmin){
                console.log("Admin verified");
            } else{
                Log.log(messages.BAD_AUTH_DATA,req.body);
                return res.status(400).json({error : messages.BAD_AUTH_DATA});
            }
        } else{
            Log.log(messages.USER.MISSING_FIELDS,req.body);
            return res.status(400).json({error : messages.MISSING_FIELDS});
        }
    } else{
        Log.log(messages.USER.NO_AUTH_DATA,req.body);
        return res.status(400).json({error : messages.USER.NO_AUTH_DATA});
    }
    /* serviceProvider = new ServiceProvider(req.body);
    serviceProvider.save(function(err,ok){
        if (err){
            Log.log(err.message,req.body);
            res.status(400).json({error : err.message});
        }else{            
            res.status(200).json({ message : "Provider registered successfully"});   
        }
    }); */
}