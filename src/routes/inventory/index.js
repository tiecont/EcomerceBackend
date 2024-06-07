import express from 'express';
import inventoryController from '../../controllers/inventory.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

router.use(authenticationV2)
router.post('/', asyncHandler(inventoryController.addStock))

export default router