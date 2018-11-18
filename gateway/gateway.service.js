const Config = require("./config.json")

exports.getNetwork = async function ( number ){    
    var hash = Config.networks_hash;    
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
