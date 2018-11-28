const NotifyService = require("./notify.service");

exports.update = async function (req,res){    
    return NotifyService.update(req,res);
}