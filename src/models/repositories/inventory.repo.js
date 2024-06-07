'use strict'

import { convertToObjectIdMongodb } from "../../utils/index.js"
import inventoryModel from "../inventory.model.js"

export const insertInventory = async ({ product_id, shop_id, stock, location = 'unKnow'}) => {
    return await inventoryModel.create({
        inven_productId: product_id,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shop_id,
    })
}

export const reservationInventory = async ({ productId, quantity, cartId}) => {
    const query = {
        inven_productId: convertToObjectIdMongodb(productId),
        inven_stock: {$gte: quantity}
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, option = { upsert: true, new: true}
    return await inventoryModel.updateOne(query, updateSet, option)
}