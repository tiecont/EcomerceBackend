'use strict'

import { ProductSchema } from "../product.model.js"

export const findAllDraftForShop = async ({ query, limit, skip}) => {
    return await ProductSchema.find(query).
    populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}