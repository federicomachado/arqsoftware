const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.post('/consume', controller.consume);
module.exports = router;