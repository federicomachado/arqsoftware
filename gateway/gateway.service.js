

exports.getNetwork = async function ( number ){
    console.log("Received number is: " + number);
    var hash = {
        "3" : {
            "" : "Amex",
            "6" : { "" : "Diners"},        
            "7" : { "" : "Amex" },
            "8" : { "" : "Diners"},
            "0" : {
                "0" : {
                    "0" : { "" : "Diners"},
                    "1" : { "" : "Diners"},
                    "2" : { "" : "Diners"},
                    "3" : { "" : "Diners"},
                    "4" : { "" : "Diners"},
                    "5" : { "" : "Diners"},
                }
            }
        },
        "4" : { "" : "Visa" },
        "5" : { "" :  "Mastercard" },
        "6" : {
             "0" : {
                "1" : {
                    "1" : { "" : "Discover"}
                }
             },
             "4" : {
                "4" : { "" : "Discover" }
             },
             "5" : { "" : "Discover"}
        }
    };

    var contador = 0;
    var found = false;
    while ( !found ) {
        hash = hash[number[contador]]
        if (!hash) {
            return "";
        }
        else{
            if (hash[number[contador+1]] == undefined) {
                return hash[""];
            }    
        }   
        contador+=1; 
    }    
}
