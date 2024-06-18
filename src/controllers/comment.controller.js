'use strict'
import { SuccessResponse } from '../core/success.response.js'
import CommentService from '../services/comment.service.js'
export default new class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Comment Success',
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }
    getCommentsByParentId = async (req, res, next ) => {
        new SuccessResponse({
            message: 'Get Comment Success!',
            metadata: await CommentService.getCommentsByParentId(req.query)
        }).send(res)
    }
    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Comment Success',
            metadata: await CommentService.deleteComments(req.body)
        }).send(res)
    }
}