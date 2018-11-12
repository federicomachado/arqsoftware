const express = require('express');
const routerSecurity = express.Router();
const security_controller = require('../controllers/security.controller');


routerSecurity.post('/register', security_controller.register);
routerSecurity.post('/login', security_controller.login);
routerSecurity.post('/role', security_controller.role);



module.exports = routerSecurity;