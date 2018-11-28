const ThresholdService = require("./threshold.service");

exports.set_treshold = async function (req,res){                
   return ThresholdService.set_threshold(req,res);
}