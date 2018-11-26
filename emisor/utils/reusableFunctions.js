
var moment = require("moment");
const config = require("../config.json");
const crypto = require("crypto");

exports.calculateDaysTransaction  = function calculateDaysTransaction(transactionDate){
    var stLogTitle = "calculateDaysTransaction";
    try {   
        var todayDate = moment(new Date(), config.default_expires_format).toDate();
        var transDate = moment(transactionDate, config.default_expires_format).toDate();
        var diasdif= todayDate.getTime()-transDate.getTime();
        var countDays = Math.round(diasdif/(1000*60*60*24));
        return countDays;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getTodayDate  = async function getTodayDate() {
    var stLogTitle = "getTodayDate";
    try {
        var todayDate = new Date();
        return moment(todayDate, config.default_expires_format).toDate();
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getSecurityCode  = async function getSecurityCode(number, expireDate) {
    var stLogTitle = "getSecurityCode";
    try {
        var arrDate = [];
        if (expireDate.indexOf("/")) {
            arrDate = expireDate.split("/");
        } else if (expireDate.indexOf("-")) {
            arrDate = expireDate.split("-");
        }
        var dateToSum = arrDate[0] + arrDate[1];
        number = number + dateToSum;
        var arrNum = number.split("");
        var sum = 0;
        for (var i = 0; i < arrNum.length; i++) {
            sum = parseInt(sum) + parseInt(arrNum[i]);
        }
        return formatnumber(parseInt(sum));
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
 function formatnumber(number) {
    var format = "00" + number;
    format = format.substring(format.length - 3, format.length);
    return format;
}
exports.getBinNumberHash  = async function getBinNumberHash(numCC) {
    var stLogTitle = "getBinNumberHash";
    try {
        numCC = numCC.substring(0, 6);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}
exports.getAccountNumPlusDigitHash  = async function getAccountNumPlusDigitHash(numCC) {
    var stLogTitle = "getAccountNumPlusDigitHash";
    try {
        numCC = numCC.substring(numCC.length - 10, numCC.length);
        var binNumHash = await crypto.createHash('sha256').update(numCC, 'utf8').digest('hex');
        return binNumHash;
    } catch (error) {
        console.log(stLogTitle, error);
    }
}

