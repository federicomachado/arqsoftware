const DevolutionController = require('./devolution.controller');
const middleware = require("../utils/token.middleware");
const express = require('express');
const routerCommerce = express.Router();

routerCommerce.post('/devolution',middleware.auth, middleware.key, async function (req, res){
    return  DevolutionController.createDevolution(req.body,res);            
});
module.exports = routerCommerce;

