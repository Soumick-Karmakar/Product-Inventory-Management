const mongoose = require('mongoose');
const { Schema } = mongoose;

//creating schema for product
const productSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    ip_rating:{
        type: String
    },
    watts:{
        type: Number,
        required: true
    },
    beam_angle:{
        type: Number
    },
    CCT1:{
        type: Number,
        required: true
    },
    CCT2:{
        type: Number
    },
    CCT3:{
        type: Number
    },
    dimension:{
        type: String
    },
    description:{
        type: String
    },
    image:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    }
  });

module.exports = mongoose.model('product', productSchema);