'use strict'

import Logger from '../loggers/discord.log.v2.js'
export const pushToLogDiscord = async (req, res, next) => {
    try {
        Logger.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET' ? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}`
        })
        return next()
    } catch (error) {
        next(error)
    }
}