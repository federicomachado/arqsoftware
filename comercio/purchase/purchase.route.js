const express = require('express');
const routerCommerce = express.Router();
const purchase_controller = require('./purchase.controller');


routerCommerce.post('/purchase', purchase_controller.purchase_create);
module.exports = routerCommerce;