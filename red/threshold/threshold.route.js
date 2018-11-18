const express = require('express');
const router = express.Router();
const threshold_controller = require('./threshold.controller');

router.post("/threshold", threshold_controller.set_treshold);

module.exports = router; 