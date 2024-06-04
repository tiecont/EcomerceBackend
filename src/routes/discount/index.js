import express from 'express';
import discountController from '../../controllers/discount.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProducts))

// authentication   
router.use(authenticationV2)

router.post('', asyncHandler(discountController.createDiscountCode))
router.get('', asyncHandler(discountController.getAllDiscountCode))

export default router