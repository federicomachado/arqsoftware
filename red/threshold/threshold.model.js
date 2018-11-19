const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ThresholdSchema = new Schema({
    reference : { type: String, required: true},
    limit: {type: Number, required: true},    
    date: { type:Date, required:true}    
});

module.exports = mongoose.model('Threshold', ThresholdSchema);