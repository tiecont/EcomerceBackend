'use strict'
import { SuccessResponse } from '../core/success.response.js';
import { default as ProductService } from "../services/product.service.js";

export default new class AccessController {
    createProduct = async (req, res, next) => {
        console.log(req.body)
        new SuccessResponse({
           message: 'Create new Product Success',
           metadata: await ProductService.createProduct(req.body.product_type, {
            ...req.body,
            product_shop: req.user.userId
           })
       }).send(res)
   }
}
