'use strict'

import express from 'express';
import accessController from '../../controllers/access.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()


// SignUp 
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.login))

// authentication   
router.use(authenticationV2)
//
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

export default router