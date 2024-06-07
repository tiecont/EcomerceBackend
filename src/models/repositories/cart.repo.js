'use strict'
import cartModel from '../cart.model.js';
import { convertToObjectIdMongodb } from './../../utils/index.js';
export const findCartById = async (cartId) => {
    return await cartModel.findOne({ _id: convertToObjectIdMongodb(cartId), cart_state: 'active'}).lean()
}