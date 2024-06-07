import express from 'express';
import CheckoutController from '../../controllers/checkout.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const router = express.Router()

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

export default router