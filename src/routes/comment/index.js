import express from 'express';
import CommentController from '../../controllers/comment.controller.js';
import { asyncHandler } from '../../helpers/asyncHandler.js';
import { authenticationV2 } from './../../auth/authUtils.js';
const router = express.Router()

router.use(authenticationV2)
router.post('', asyncHandler(CommentController.createComment))

export default router