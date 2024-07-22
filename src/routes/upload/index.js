'use strict'
'use strict'
import express from 'express';
import uploadController from '../../controllers/upload.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
const router = express.Router()

// authentication   
// router.use(authenticationV2)
router.post('/image', asyncHandler(uploadController.uploadFile))

export default router