const express = require('express');
const routerCommerce = express.Router();
const commerce_controller = require('../controllers/commerce.controller');


routerCommerce.post('/purchases', commerce_controller.purchase_create);
module.exports = routerCommerce;