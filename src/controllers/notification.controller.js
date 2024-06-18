'use strict'
import Notification from '../services/notification.service.js';
import { SuccessResponse } from './../core/success.response.js';

export default new class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'List Notificaiton Success!!',
            metadata: await Notification.listNotiByUser(req.body)
        }).send(res)
    }
}