const express = require('express');
const routerCommerce = express.Router();
const purchase_controller = require('./purchase.controller');
const middleware = require("../utils/token.middleware");

routerCommerce.post('/purchase',middleware.auth, purchase_controller.purchase_create);
module.exports = routerCommerce;