const express = require('express');
const router = express.Router();
const controller = require('./serviceConsumer.controller');
const middleware = require("../user/user.middleware");

router.post('/consume', middleware.auth, controller.consume);
module.exports = router;