'use strict'

import { NotFoundError } from "../core/error.response.js"
import commentModel from "../models/comment.model.js"
import { convertToObjectIdMongodb } from '../utils/index.js'
export default class CommentService {
    static async createComment({ productId, userId, content, parentComentId = null}) {
        const comment = new commentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentComentId: parentComentId,
        })
        let rightValue
        if (parentComentId) {
            // reply comment
            const parentComment = await commentModel.findById(parentComentId)
            if (!parentComment) throw new NotFoundError('Parent comment does not exists!!')
            rightValue = parentComment.comment_right

            // updateMany comments
            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue}
            }, { $inc: { comment_right: 2 }})

            await commentModel.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue}
            }, { $inc: { comment_left: 2 }})
        } else {
            const maxRightValue = await commentModel.findOne({
                comment_productId: convertToObjectIdMongodb(productId)
            }, 'comment_right', { sort: { comment_right: -1}})
            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }

        // insert comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        return await comment.save()
    }
    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0 // skip
    }) {
        if (parentCommentId) {
            const parent = await commentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('Not found comment for product')
            
            const comments = await commentModel.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $st: parent.comment_left},
                comment_right: { $lte: parent.comment_right}
            }).select({ 
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({ comment_left: 1})
            
            return comments
        }
        const comments = await commentModel.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parent: convertToObjectIdMongodb(parentCommentId)
        }).select({ 
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({ comment_left: 1})
        return comments
    }
}