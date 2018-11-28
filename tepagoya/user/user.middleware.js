const express = require('express');
const router = express.Router();
const UserService = require("./user.service");
const messages = require("../messages.json");
const config = require("../config.json");
const Log = require("../logs/"+config.log_service+".service");

exports.auth = async function (req,res,next){
    headers = req.headers;    
    if (headers.authorization){
        let verified = await UserService.verify_token(headers.authorization);
        if (verified.valid){
            return next();
        }else{
            res.status(verified.status).json({message: verified.message});    
            return res.end();
        }
    } else{
        Log.log(messages.USER.LOGIN_NO_TOKEN,req.body);
        res.status(400).json({message : messages.USER.LOGIN_NO_TOKEN});    
        return res.end();
    }
}
