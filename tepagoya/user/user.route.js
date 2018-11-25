const express = require('express');
const router = express.Router();
const controller = require('./user.controller');

module.exports = router;
router.post('/signup',controller.user_signup);