'use strict'
import express from 'express';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

router.get('', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))

// authentication   
router.use(authenticationV2)
//
router.post('', asyncHandler(productController.createProduct))
router.patch('/:product_id', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProduct))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct))

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishForShop))

export default router