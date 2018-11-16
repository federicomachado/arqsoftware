const express = require('express');
const routerCommerce = express.Router();
const commerce_controller = require('./controller');


routerCommerce.post('/purchases', commerce_controller.purchase_create);
routerCommerce.post('/gateways', commerce_controller.gateway_create);
module.exports = routerCommerce;