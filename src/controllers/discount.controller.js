'use strict'

import { SuccessResponse } from "../core/success.response.js"
import DiscountService from "../services/discount.service.js"

export default new class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfull Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shop_id: req.user.userId
            })
        }).send(res)
    }
    getAllDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfull Code Found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shop_id: req.user.userId
            })
        }).send(res)
    }
    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfull Get Amount of Code',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successfull Code Found with Products',
            metadata: await DiscountService.getAllDiscountCodesWithProducts({
                ...req.query
            })
        }).send(res)
    }
}