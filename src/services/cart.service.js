'use strict'
import { BadRequestError, NotFoundError } from '../core/error.response.js'
import cartModel from '../models/cart.model.js'
import { getProductById } from '../models/repositories/product.repo.js'
import { default as ProductServiceV2 } from "../services/product.service.xxx.js"
/* 
    Key Features: Cart Service
    -- add product to cart [USER]
    -- reduce product quantity by one [USER]
    -- increase quantity by one [USER]
    -- get cart [USER]
    -- DELETE cart [USER]
    -- DELETE cart item [USER]
*/

export default class CartService {
    // START REPO CART //
    static async createUserCart({ userId, product}) {
        const query = { cart_userId: userId, cart_state: 'active'},
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            }
        }, options = { upsert: true, new: true}
        return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateProductCart({ userId, product}) {
        const query = { cart_userId: userId,
            cart_state: 'active'
         }, updateSet = {
            $push: {
                'cart_products': product
            }
         }, options = { upsert: true, new: true}
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }
    static async updateUserCartQuantity({ userId, product}) {
        const { productId, quantity } = product
        const query = { cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
         }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
         }, options = { upsert: true, new: true}
        return await cartModel.findOneAndUpdate(query, updateSet, options)
    }
    // END REPO CART //
    static async addToCart({ userId, product = {}}) {
        const { productId } = product
        const userCart = await cartModel.findOne({ cart_userId: userId})
        const productInfo = await ProductServiceV2.findProduct({ productId })
        if (!userCart) {
            // CREATE cart for user
            return await CartService.createUserCart({ userId, product})
        }
        // if cart does not have any products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        if (product.name !== productInfo.product_name || product.price !== productInfo.product_price) throw new BadRequestError('Invaid product name or price')
        if (product.shopId !== productInfo.product_shop.toString()) throw new BadRequestError('Invalid shop discount!!!')
        // if product is exists => update quantity
        if (userCart) {
            const allProductsIsNotMatchesIds = userCart.cart_products.every(cart_product => {
                return cart_product.productId !== product.productId
            })
            if (allProductsIsNotMatchesIds) {
                return await CartService.updateProductCart({ userId, product })
            } else {
                return await CartService.updateUserCartQuantity({ userId, product })
            }
        }
    }
    // UPDATE CART QUANTITY
    static async addToCartV2({ userId, products = {}}) {
        const { productId, quantity, old_quantity } = products[0]?.item_products[0]
        // CHECK PRODUCT
        const foundProduct = await getProductById({productId})
        if (!foundProduct) throw new NotFoundError('Product not exists')
        // COMPARE
        if (foundProduct.product_shop.toString() !== products[0]?.shopId) throw new NotFoundError('Product do not belong to shop')
        if (quantity === 0) {
            return await CartService.deleteUserCartProduct({ userId, productId})
        }
        const listUserCart = await CartService.getListUserCart({userId})
        listUserCart.cart_products.map(item => {
            if (item.productId === productId) {
                if (old_quantity !== item.quantity) throw new NotFoundError('Quantity does not exists')
            }
        })
        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }
    static async deleteUserCartProduct({ userId, productId}) {
        const query = { cart_userId: userId, cartState: 'active'},
        updateSet = {
            $pull: {
                cart_products: { productId }
            }
        }
        return await cartModel.updateOne(query, updateSet)
    }
    static async getListUserCart({userId}) {
        return await cartModel.findOne({
            cart_userId: +userId,
        }).lean()
    }
}