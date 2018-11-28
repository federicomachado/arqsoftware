const express = require('express');
const router = express.Router();
const superagent = require("superagent");
const config = require("../config.json");
const messages = require("../messages.json");
const bcrypt = require("bcrypt");
const Log = require("../logs/"+config.log_service+".service");

exports.key = async function (req,res,next){    
    if (req.headers.authorization && bcrypt.compareSync(config.tepagoya_key,req.headers.authorization)){
        next()
    } else{
        Log.log(messages.AUTH.INVALID_KEY,req.body);
        res.status(400).json({error :messages.AUTH.INVALID_KEY})            
        res.end();
    }
}
