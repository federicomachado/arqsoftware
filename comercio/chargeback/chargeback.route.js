const express = require('express');
const routerCommerce = express.Router();


routerCommerce.post('/chargeback', async function (req, res){
    console.log("req: ",req);

});
module.exports = routerCommerce;