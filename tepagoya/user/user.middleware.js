const express = require('express');
const router = express.Router();

exports.auth = function (req,res,next){
    console.log(req.body);
    res.status(400).json({message: "Error"});    
    return res.end();
    
}
