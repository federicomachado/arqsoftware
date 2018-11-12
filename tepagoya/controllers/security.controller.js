const User = require('./../../core/models/user.model');
const request = require('superagent');

exports.register = function (req,res){    
    res.send(req.body);
}

exports.login = function (req,res){    
    res.send(req.body);
}

exports.role = function (req,res){    
    res.send(req.body);
}