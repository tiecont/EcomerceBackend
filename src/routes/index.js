'use strict'
import express from 'express';
import check from './../auth/checkAuth.js';
import access from './access/index.js';
import product from './shop/index.js';
const router = express.Router()

//check API key 
router.use(check.apiKey)
// check permission
router.use(check.permission('0000'))

router.use('/v1/api/product', product)
router.use('/v1/api', access)

export default router