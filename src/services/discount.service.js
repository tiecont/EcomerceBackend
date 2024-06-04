'use strict'

import { BadRequestError, NotFoundError } from "../core/error.response.js"
import discountModel from "../models/discount.model.js"
import { checkDiscountExists, findAllDiscountCodesUnselect } from "../models/repositories/discount.repo.js"
import { findAllProducts } from "../models/repositories/product.repo.js"
import { convertToObjectIdMongodb } from "../utils/index.js"

/*
    Discount Services
    1- Generator Discount Code [Shop | Admin]
    2- Get Discount Amount [User]
    3- Get All  Discount Code [User | Shop]
    4- Verify Discount code [User]
    5- Delete Discount Code [Shop | Admin]
    6- Cancel Discount Code [User]
*/

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shop_id, applies_to,
             min_order_value, product_ids, name, description, users_used,
             type, value, max_value, max_uses, used_count, max_uses_per_user
        } = payload
        // kiểm tra
        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end date')
        }
        // CREATE INDEX FOR DISCOUNT CODE
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id),

        }).lean()
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount Exist!')
        }
        const newDiscount = await discountModel.create({
            discount_name: name,
            discount_description: description, 
            discount_type: type,
            discount_value: value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_used_count: used_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_min_order_value: min_order_value,
            discount_max_value: max_value,
            discount_shop_id: shop_id,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })
        return newDiscount
    }
    static async updateDiscountCode() {

    }
    /* 
        GET ALL DISCOUNT CODES AVALABLE WITH PRODUCTS
    */
   static async getAllDiscountCodesWithProducts({
    code, shop_id, user_id, limit, page
   }) {
    // CREATE INDEX FOR DISCOUNT_CODE
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id),
        }).lean()
        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount code does not exist!')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await findAllProducts({ 
                filter: {
                    product_shop: convertToObjectIdMongodb(shop_id),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        if (discount_applies_to === 'specific') {
            products = await findAllProducts({ 
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return products
    }

    // GET ALL DISCOUNT CODE OF SHOP
   static async getAllDiscountCodesByShop({
    limit, page, shop_id
   }) {
        const discounts = await findAllDiscountCodesUnselect({ 
            limit: +limit,
            page: +page,
            filter: {
                discount_shop_id: convertToObjectIdMongodb(shop_id),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shop_id'],
            model: discountModel
        })
        return discounts
   }

   // APPLY DISCOUNT CODE
   static async getDiscountAmount({code, user_id, shop_id, products}) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shop_id)
            }
        })
        if (!foundDiscount) {
            throw new NotFoundError('Discount code does not exist!')
        }

        const { 
            discount_is_active,
            discount_type,
            discount_max_uses,
            discount_users_used,
            discount_value,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_start_date,
            discount_end_date
        } = foundDiscount
        if (!discount_is_active) throw new NotFoundError('Discount code has expired!')
        if (!discount_max_uses) throw new NotFoundError('Discount code are out!')
        if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired!')
        }
        
        // CHECK XEM CÓ GIÁ TRỊ TỐI THIỂU HAY KHÔNG
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)
            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount minimun order required of ${discount_min_order_value}`)
            }
        }
        if (discount_max_uses_per_user > 0) {
            const userUsedDiscount = discount_users_used.find(user => user.userId === user_id)
            if (userUsedDiscount) throw new NotFoundError('Discount Not Avalable')
        }
        
        // CHECK DISCOUNT = fixamount or percentage
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)
        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
   }
   static async deleteDiscountCode({ shop_id, code}) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shop_id: convertToObjectIdMongodb(shop_id)
        })
        return deleted
   }

   // CANCEL DISCOUNT CODE
   static async cancelDiscountCode({ code, shop_id, user_id}) {
        const foundDiscount = await checkDiscountExists({
            model: discountModel,
            filter: {
                discount_code: code,
                discount_shop_id: convertToObjectIdMongodb(shop_id)
            }
        })
        if (!foundDiscount) throw new NotFoundError('Discount code does not exist')
        
        const result = await discountModel.findByIdAndUpdate({
            $pull: {
                discount_users_used: user_id
            },
            $inc: {
                discount_max_uses: 1,
                discount_used_count: -1
            }
        })
        return result
   }
}

export default DiscountService