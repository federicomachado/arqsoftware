const express = require('express');
const router = express.Router();
const superagent = require("superagent");
const config = require("../config.json");
const messages = require("../messages.json");


exports.key = async function (req,res,next){    
    if (req.headers.authorization && req.headers.authorization == config.tepagoya_key){
        next()
    } else{
        res.status(400).json({error :messages.AUTH.INVALID_KEY})            
        res.end();
    }
}
