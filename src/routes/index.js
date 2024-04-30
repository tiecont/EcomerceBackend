'use strict'

import express from 'express';
import check from './../auth/checkAuth.js';
import signUp from './access/index.js';
const router = express.Router()

//check API key 
router.use(check.apiKey)
// check permission
router.use(check.permission('0000'))
router.use('/v1/api', signUp)

export default router