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

   updateProduct = async (req, res, next ) => {
    new SuccessResponse({
        message: 'Update Product Success!',
        metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.product_id, {
            ...req.body,
            product_shop: req.user.userId
        })
    })
   }

   publishProduct = async (req, res, next ) => {
        new SuccessResponse({
            message: 'Publish Product Success',
            metadata: await ProductServiceV2.publishProductByShop({
            product_id: req.params.id,
            product_shop: req.user.userId
            })
        }).send(res)
    }
    unPublishProduct = async (req, res, next ) => {
        new SuccessResponse({
            message: 'unPublishProductByShop Product Success',
            metadata: await ProductServiceV2.unPublishProductByShop({
            product_id: req.params.id,
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

   getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get List Publish Successfully',
        metadata: await ProductServiceV2.findAllPublishForShop({
         product_shop: req.user.userId
        })
    }).send(res)
   }

   getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get List Search Successfully',
        metadata: await ProductServiceV2.searchProducts(req.params)
    }).send(res)
   }

   findAllProducts = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get All Products Successfully',
        metadata: await ProductServiceV2.findAllProducts(req.query)
    }).send(res)
   }

   findProduct = async (req, res, next) => {
    new SuccessResponse({
        message: 'Get Product Successfully',
        metadata: await ProductServiceV2.findProduct({
            product_id: req.params.product_id
        })
    }).send(res)
   }

   // END QUERY
   
}
