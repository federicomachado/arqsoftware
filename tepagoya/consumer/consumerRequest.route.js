const express = require('express');
const router = express.Router();
const controller = require('./consumerRequest.controller');

router.post('/consume', controller.consume);
module.exports = router;