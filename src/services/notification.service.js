'use strict'

import notificationModel from "../models/notification.model.js"

export default class Notification {
    static async pushNotiToSystem ({ type = 'SHOP-001', receivedId = 1, senderId = 1, options = {}}) {
        let noti_content
        if (type === 'SHOP-001') {
            noti_content = `@@@ vừa mới thêm một sản phẩm: @@@`
        } else if ( type === 'PROMOTION-001') {
            noti_content = `@@@ vừa mới thêm một voucher: @@@`
        }
        const newNoti = await notificationModel.create({
            noti_type: type,
            noti_content: noti_content,
            noti_options: options,
            noti_receivedId: receivedId,
            noti_senderId: senderId
        })
        return newNoti
    }
    static async listNotiByUser ({ 
        userId = 1,
        type = 'ALL',
        isRead = 0
    }) {
        const match = { noti_receivedId: userId}
        if (type !== 'ALL') {
            match['noti_type'] = type
        }
        return await notificationModel.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_receivedId: 1,
                    noti_senderId: 1,
                    noti_content: {
                        $concat: [
                            {
                                $substr: ['$noti_options.shop_name', 0, -1]
                            },
                            ` Vừa mới thêm một sản phẩm mới: `,
                            {
                                $substr: ['$noti_options.product_name', 0, -1]
                            }
                        ]
                    },
                    createAt: 1,
                    noti_options: 1
                }
            }
        ])
    }
}