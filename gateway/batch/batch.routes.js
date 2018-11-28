const BatchController = require('./batch.controller');
const BatchService = require("./batch.service");
const middleware = require("../utils/token.middleware");
const express = require('express');
const routerCommerce = express.Router();


routerCommerce.post('/batch',middleware.key, BatchService.cache, BatchController.getBatchInfo);
module.exports = routerCommerce;

