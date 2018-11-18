const express = require('express');
const router = express.Router();
const gateway_controller = require('./gateway.controller');

router.post("/", gateway_controller.purchase_verify);

module.exports = router; 