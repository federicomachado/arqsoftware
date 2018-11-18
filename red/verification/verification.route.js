const express = require('express');
const router = express.Router();
const verification_controller = require('./verification.controller');

router.post("/purchase", verification_controller.card_verify);
router.post("/treshold", verification_controller.set_treshold);

module.exports = router; 