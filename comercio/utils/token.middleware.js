const express = require('express');
const router = express.Router();
const superagent = require("superagent");
const config = require("../config.json");

exports.auth = async function (req,res,next){    
    await superagent.post(config.login_url).send({ username : config.provider_name, password: config.provider_password}).end(function(err,resp){
        if (err){            
            if (err.status){
                res.status(err.status).json({error : err})            
            } else{
                res.status(400).json({error : err})            
            }
            return res.end()
        } else{   
            res.setHeader("authorization",resp.body.token);       
            next()
        }        
    });            
}
