const express = require('express');
const router = express.Router();
const controller = require('./serviceConsumer.controller');

router.post('/consume', controller.consume);
module.exports = router;