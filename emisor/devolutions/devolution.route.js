
const middleware = require("../utils/token.middleware");
const express = require('express');
const routerCommerce = express.Router();
const Controller = require("./devolution.controller");

routerCommerce.post('/devolution', middleware.key, async function (req, res){
    return Controller.createDevolution(req,res);
});
module.exports = routerCommerce;

