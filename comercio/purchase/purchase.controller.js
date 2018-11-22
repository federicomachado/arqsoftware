
const superagent = require("superagent");
const PurchaseService = require("./purchase.service");

exports.purchase_create = async function (req,res){      
    return await PurchaseService.purchase_create(req,res);

}


