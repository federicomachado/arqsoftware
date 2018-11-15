const express = require('express');
const router = express.Router();
const controller = require('./controller');


router.post('/consume', controller.consume);
router.post('register',controller.register_provider);
module.exports = router;