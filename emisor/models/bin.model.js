const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let binSchema = new Schema({ 
    idBin: mongoose.Schema.Types.ObjectId,
    binNumber: { type: String, required: true, max: 100}   
});

module.exports = mongoose.model('Bin', binSchema);