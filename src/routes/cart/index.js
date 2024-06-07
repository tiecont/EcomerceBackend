import express from 'express';
import cartController from '../../controllers/cart.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const router = express.Router()

router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.listToCart))


export default router