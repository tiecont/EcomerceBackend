'use strict'

import { SuccessResponse } from "../core/success.response.js"
import CartService from "../services/cart.service.js"

export default new class CartController {
    
    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Add to cart successfully',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }
    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'update cart product successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }
    delete = async (req, res, next) => {
        new SuccessResponse({
            message: 'delete cart product successfully',
            metadata: await CartService.deleteUserCartProduct(req.body)
        }).send(res)
    }
    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'list cart product successfully',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}