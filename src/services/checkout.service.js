'use strict'
import orderModel from '../models/order.model.js';
import { BadRequestError } from './../core/error.response.js';
import { findCartById } from './../models/repositories/cart.repo.js';
import { checkProductByServer } from './../models/repositories/product.repo.js';
import DiscountService from './discount.service.js';
import { acquireLock, releaseLock } from './redis.service.js';

export default class CheckoutService {

    static async checkoutReview ({cartId, userId, shop_order_ids = []}) {
        // check cart_id
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart does not exist')
        
        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // tính tổng tiền bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = []} = shop_order_ids[i]
            //check product avalable
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`Checkout Product On Server::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong!!!')
            
            // tổng tiền hàng
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }
            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                //tổng cộng discount giảm giá
                checkout_order.totalDiscount += discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tổng thanh toán cuối cùng
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId, userId, shop_order_ids
        })
        // check product stock?
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]::`, products)
        // OPTIMISTIC LOCK
        const accquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock({ productId, quantity, cartId })
            accquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }
        if (accquireProduct.includes(false)) {
            throw new BadRequestError('Một số sản phẩm đã được cập nhật, vui lòng quay lại giỏ hàng,...')
        }
        const newOrder = await orderModel.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        if (newOrder) {
            // remove products cart
        }
        return newOrder
    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {

    }

    static async cancelOrderByUser() {

    }

    static async updateOrderStatusByShop() {
        
    }
}