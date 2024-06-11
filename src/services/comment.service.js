'use strict'

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
}