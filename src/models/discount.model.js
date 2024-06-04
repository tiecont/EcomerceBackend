'use strict'

import mongoose, { Schema } from 'mongoose'

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'

const discountSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: {type: String, default: 'fixed_amount'}, // percentage
    discount_value: { type: Number, required: true }, // 10.000 or 10%
    discount_max_value: { type: Number, required: true },
    discount_code: { type: 'String', required: true },
    discount_start_date: { type: Date, required: true },
    discount_end_date: { type: Date, required: true },
    discount_max_uses: { type: Number, required: true },
    discount_used_count: { type: Number, required: true}, // số discount đã sử dụng
    discount_users_used: { type: Array, default: []},
    discount_max_uses_per_user: { type: Number, required: true}, // số lượng tối đa mỗi user được use
    discount_min_order_value: { type: Number, required: true},
    discount_shop_id: { type: Schema.Types.ObjectId, ref: 'Shop'},
    discount_is_active: { type: Boolean, required: true},
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: { type: Array, default: []} // số sản phẩm được áp dụng
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
})

export default mongoose.model(DOCUMENT_NAME, discountSchema)