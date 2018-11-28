const Service = require('./devolution.service');

async function createDevolution(req,res){ 
    return Service.create_devolution_route(req,res);
 }

 module.exports = {createDevolution};