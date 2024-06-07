'use strict'

import Logger from '../loggers/discord.log.v2.js'
export const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToMessage(req.get('host'))
        return next()
    } catch (error) {
        next(error)
    }
}