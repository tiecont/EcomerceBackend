'use strict'
import { NotFoundError } from "../core/error.response.js"
import commentModel from "../models/comment.model.js"
import { findProduct } from '../models/repositories/product.repo.js'
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
                comment_left: { $gt: parent.comment_left},
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
            comment_parent: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({ comment_left: 1})
        return comments
    }
    static async deleteComments({ commentId, productId}) {
        const foundProduct = await findProduct({ productId })
        if (!foundProduct) throw new NotFoundError('Product not found')
        
        const comment = await commentModel.findById(commentId)
        if (!comment) throw new NotFoundError('Comment not found')
        
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right
        // 2
        const witdh = rightValue - leftValue + 1
        // 3 delete all children commentId
        await commentModel.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue, $lte: rightValue}
        })
        // 4 update left and right value
        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue}
        }, {
            $inc: { comment_right: -witdh}
        })
        await commentModel.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue}
        }, {
            $inc: { comment_left: -witdh}
        })
        return true
    }
}