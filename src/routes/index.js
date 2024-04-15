'use strict'

import express from 'express'
import signUp from './access/index.js'
const router = express.Router()

router.use('/v1/api', signUp)

export default router