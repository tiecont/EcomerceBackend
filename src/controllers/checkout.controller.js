'use strict'
import { SuccessResponse } from './../core/success.response.js';
import CheckoutService from './../services/checkout.service.js';

export default new class CheckoutController {
    
    checkoutReview = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Checkout Success!!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}