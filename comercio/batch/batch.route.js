const BatchController = require('./batch.controller');
const middleware = require("../utils/token.middleware");
const express = require('express');
const routerCommerce = express.Router();

routerCommerce.post('/batch',middleware.key, middleware.auth, BatchController.getBatchInfo);
module.exports = routerCommerce;

