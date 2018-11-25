const express = require('express');
const router = express.Router();
const controller = require('./serviceProvider.controller');
const middleware = require("../user/user.middleware");

module.exports = router;
router.post('/register',middleware.auth,controller.register_provider);