'use strict'
import { Schema, model } from 'mongoose'

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

export const productSchema = model(DOCUMENT_NAME, new Schema({
    product_name: { type: String, required: true},
    product_thumb: { type: String, required: true},
    product_description: String,
    product_price: { type: Number, required: true},
    product_quantity: { type: Number, required: true},
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture']},
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: { type: Schema.Types.Mixed, requred: true}
}, {
    collection: COLLECTION_NAME,
    timestamps: true
}))

// define product type = clothing
export const clothingSchema = model('clothing', new Schema({
    brand: { type: String, required: true},
    size: String,
    materials: String
}, {
    collection: 'clothes',
    timestamps: true
}))

// define product type = Electronic
export const electronicSchema = model('electronic', new Schema({
    manufacturer: { type: String, required: true},
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
}))