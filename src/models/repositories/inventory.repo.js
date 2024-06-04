'use strict'

import inventoryModel from "../inventory.model.js"

export const insertInventory = async ({ product_id, shop_id, stock, location = 'unKnow'}) => {
    return await inventoryModel.create({
        inven_productId: product_id,
        inven_stock: stock,
        inven_location: location,
        inven_shopId: shop_id,
    })
}