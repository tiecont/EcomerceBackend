'use strict'
import { SuccessResponse } from '../core/success.response.js';
// import { default as ProductService } from "../services/product.service.js";
import { default as ProductServiceV2 } from "../services/product.service.xxx.js";

export default new class AccessController {
    createProduct = async (req, res, next) => {
    //     console.log(req.body)
    //     new SuccessResponse({
    //        message: 'Create new Product Success',
    //        metadata: await ProductService.createProduct(req.body.product_type, {
    //         ...req.body,
    //         product_shop: req.user.userId
    //        })
    //    }).send(res)
       new SuccessResponse({
        message: 'Create new Product Success',
        metadata: await ProductServiceV2.createProduct(req.body.product_type, {
         ...req.body,
         product_shop: req.user.userId
        })
    }).send(res)


   }
   // QUERY
   /**
    * @description Get all drafts for shop
    * @param {Number} limit
    * @param {Number} skip
    * @return {JSON}
    */
   getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get List Draft Successfully',
        metadata: await ProductServiceV2.findAllDraftForShop({
         product_shop: req.user.userId
        })
    }).send(res)
   }
   // END QUERY
   
}
