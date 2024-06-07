'use strict'
import { BadRequestError } from '../core/error.response.js';
import inventoryModel from '../models/inventory.model.js';
import { getProductById } from './../models/repositories/product.repo.js';

export default class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '125, Trần Phú, HCM City'
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('Product does not exists!!')

        const query = { inven_shopId: shopId, inven_productId: productId },
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, option = { upsert: true, new: true}
        return await inventoryModel.findOneAndUpdate(query, updateSet, option)
    }
}