const express = require('express');
const router = express.Router();
const controller = require('./notify.controller');

router.post("/notify",controller.update);

module.exports = router; 