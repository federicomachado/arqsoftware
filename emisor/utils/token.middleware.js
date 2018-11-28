const express = require('express');
const router = express.Router();
const superagent = require("superagent");
const config = require("../config.json");
const messages = require("./messages.json");
const bcrypt = require("bcrypt");
const Log = require("../logs/"+config.log_service+".service");

exports.auth = async function (req,res,next){    
    await superagent.post(config.login_url).send({ username : config.provider_name, password: config.provider_password}).end(function(err,resp){
        if (err){            
            if (err.status){
                res.status(err.status).json({error : err})            
            } else{
                req.body.params = {};
                Log.log(err,req.body);
                res.status(400).json({error : err})            
            }
            return res.end()
        } else{   
            res.setHeader("authorization",resp.body.token);       
            next()
        }        
    });            
}

exports.key = async function (req,res,next){
    if (req.headers.authorization && bcrypt.compareSync(config.tepagoya_key,req.headers.authorization)){
        next()
    } else{
        Log.log(AUTH.INVALID_KEY,req.body);
        res.status(400).json({error :messages.AUTH.INVALID_KEY})            
    }
}
