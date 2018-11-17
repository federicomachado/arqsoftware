const express = require('express');
const router = express.Router();
const controller = require('./serviceProvider.controller');

module.exports = router;
router.post('/register',controller.register_provider);