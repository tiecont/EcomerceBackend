'use strict'

import express from 'express'
import check from '../../auth/checkAuth.js'
import accessController from '../../controllers/access.controller.js'
const router = express.Router()


// SignUp 
router.post('/shop/signup', check.asyncHandler(accessController.signUp))
export default router