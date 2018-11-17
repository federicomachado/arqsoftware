

exports.getNetwork = async function ( number ){
    console.log("Received number is: " + number);
    /* Visa: 4xxxxxx
Mastercard: 5xxxxx
Discover: 6011xx, 644xxx, 65xxxx
American Express: 3xxxx, 37xxxx
Diner's Club and Carte Blanche: 300xxx-305xxx, 36xxxx, 38xxxx */
    return "123";
}
