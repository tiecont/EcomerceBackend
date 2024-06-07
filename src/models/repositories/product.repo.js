'use strict'

import { Types } from 'mongoose';
import { BadRequestError } from '../../core/error.response.js';
import { convertToObjectIdMongodb, getSelectData } from '../../utils/index.js';
import { ProductSchema } from "../product.model.js";

export const findAllDraftForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip})
}

export const findAllPublishForShop = async ({ query, limit, skip}) => {
    return await queryProduct({ query, limit, skip})
}

export const searchProductByUser = async ({ keySearch }) => {
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
    if (!foundShop) throw new BadRequestError('Product is not longer by shop')

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
export const findProduct = async ({ productId, select }) => {
    return await ProductSchema.findById(productId).select(getSelectData(select))
}
export const updateProductById = async ({ productId, bodyUpdate, model, isNew = true}) => {
    return await model.findByIdAndUpdate( productId, bodyUpdate, {
        new: isNew
    })
    
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

export const getProductById = async ( productId ) => {
    return await ProductSchema.findOne({ _id: convertToObjectIdMongodb(productId)}).lean()
}

export const checkProductByServer = async (products) => {
    return await Promise.all(products.map( async product => {
        const foundProduct = await getProductById(product.productId)
        if (foundProduct) return {
            price: foundProduct.product_price,
            quantity: product.quantity,
            productId: product.productId
        }
    }))
}