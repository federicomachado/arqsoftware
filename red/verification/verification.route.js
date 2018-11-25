const express = require('express');
const router = express.Router();
const verification_controller = require('./verification.controller');
const middleware = require("../utils/token.middleware");

router.post("/purchase", middleware.key, verification_controller.card_verify);

module.exports = router; 