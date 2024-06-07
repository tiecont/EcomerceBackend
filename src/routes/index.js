'use strict'
import express from 'express';
import check from './../auth/checkAuth.js';
import { pushToLogDiscord } from './../middleware/index.js';
import access from './access/index.js';
import cart from './cart/index.js';
import checkout from './checkout/index.js';
import discount from './discount/index.js';
import inventory from './inventory/index.js';
import product from './shop/index.js';
const router = express.Router()

// add log to discord
router.use(pushToLogDiscord)
//check API key 
router.use(check.apiKey)
// check permission
router.use(check.permission('0000'))

router.use('/v1/api/inventory', inventory)
router.use('/v1/api/checkout', checkout)
router.use('/v1/api/discount', discount)
router.use('/v1/api/cart', cart)
router.use('/v1/api/product', product)
router.use('/v1/api', access)

export default router