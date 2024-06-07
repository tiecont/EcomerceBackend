'use strict'

import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: { type: Object, default: {}},
    order_shipping: { type: Object, default: {}},
    order_payment: { type: Object, default: {}},
    order_products: { type: Array, required: true},
    order_trackingNumber: { type: String, default: '#0000112062024'},
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}
}, {
    colections: COLLECTION_NAME,
    timestamps: {
        createAt: 'createOn',
        updateAt: 'modifiedOn',
    }
})

export default mongoose.model(DOCUMENT_NAME, orderSchema)