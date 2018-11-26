const express = require('express');
const router = express.Router();
const threshold_controller = require('./threshold.controller');
const middleware = require("../utils/token.middleware");

router.post("/threshold", middleware.key, threshold_controller.set_treshold);

module.exports = router; 