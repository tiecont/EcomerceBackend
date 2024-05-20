'use strict'
import express from 'express';
import productController from '../../controllers/product.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

// authentication   
router.use(authenticationV2)
//
router.post('', asyncHandler(productController.createProduct))

// QUERY //
router.get('/drafts/all', asyncHandler(productController.getAllDraftForShop))

export default router