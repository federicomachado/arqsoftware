const express = require('express');
const router = express.Router();
const UserService = require("./user.service");
const messages = require("../messages.json");

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
        res.status(400).json({message : messages.USER.LOGIN_NO_TOKEN});    
        return res.end();
    }
}
