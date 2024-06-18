'use strict'

import { Schema, mongoose } from "mongoose";
// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'
var shopSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        emum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify:{
        type: Schema.Types.Boolean,
        default: false,
    },
    roles:{
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
// module.exports = mongoose.model('Shop', shopSchema);
export default mongoose.model(DOCUMENT_NAME, shopSchema)