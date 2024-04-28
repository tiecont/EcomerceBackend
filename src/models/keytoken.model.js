'use strict'
import { Schema, mongoose } from 'mongoose';
// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'
var keytokenSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Shop'
    },
    publicKey:{
        type: String,
        required:true,
    },
    privateKey:{
        type: String,
        required:true,
    },
    refreshToken:{
        type: Array, default: [],
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});

//Export the model
export default mongoose.model(DOCUMENT_NAME, keytokenSchema);