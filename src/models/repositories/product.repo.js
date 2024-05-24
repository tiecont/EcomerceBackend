'use strict'

import { Types } from 'mongoose';
import { getSelectData } from '../../utils/index.js';
import { ProductSchema } from "../product.model.js";

export const findAllDraftForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip})
}

export const findAllPublishForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip})
}

export const searchProductByUser = async (keySearch) => {
    const regexSearch = new RegExp(keySearch)
    const results = await ProductSchema.find({
        isPublished: true,
        $text: { $search: regexSearch}
    },{score: { $meta: 'textScore'}})
    .sort({score: { $meta: 'textScore'}}).lean()
    return results
}

export const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await ProductSchema.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null

    foundShop.isDraft = false
    foundShop.isPublished = true
    const modifiedCount = await foundShop.updateOne(foundShop)
    return modifiedCount
}

export const unPublishProductByShop = async ({ product_shop, product_id}) => {
    const foundShop = await ProductSchema.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundShop) return null
    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount } = await foundShop.updateOne(foundShop)
    return modifiedCount
}

export const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    return await ProductSchema.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
}
const queryProduct = async ({ query, limit, skip}) => {
    return await ProductSchema.find(query).
    populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}