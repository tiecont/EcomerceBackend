'use strict'

import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'

const cartSchema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending']
    },
    cart_products: { type: Array, required: true, default: []},
    cart_count_product: { type: Number, required: true, default: 0},
    cart_userId: { type: Number, required: true}
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createAt: 'createOn',
        updateAt: 'modifiedOn',
    }
})

export default mongoose.model(DOCUMENT_NAME, cartSchema)