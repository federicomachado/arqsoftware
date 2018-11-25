const express = require('express');
const router = express.Router();
const controller = require('./user.controller');
const middleware = require("./user.middleware");


router.post('/signup',middleware.auth, function(req,res) {
    controller.user_signup;   
});
router.post('/login',middleware.auth,controller.user_login);  
module.exports = router;