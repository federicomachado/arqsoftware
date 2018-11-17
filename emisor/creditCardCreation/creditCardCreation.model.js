
function createCreditCard(aCreditCard){
    var objRes = {};
    aCreditCard.save(err => {      
        if (err) {
            objRes.error = true;
            objRes.errorDetail = err;          
        }else{
            objRes.error = false;
            objRes.creditCardSaved = aCreditCard;
        }    
      
    });
    return objRes;
}

module.exports = {createCreditCard};