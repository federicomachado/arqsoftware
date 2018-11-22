const express = require('express');
const routerCommerce = express.Router();
const gateway_controller = require('./gateway.controller');


routerCommerce.post('/gateway', gateway_controller.gateway_create);
module.exports = routerCommerce;