import express from 'express';
import notificationController from '../../controllers/notification.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

router.use(authenticationV2)
router.get('/', asyncHandler(notificationController.listNotiByUser))

export default router