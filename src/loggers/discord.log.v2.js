'use strict'

import { Client, GatewayIntentBits } from "discord.js"

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        // add channel id
        this.channelId = process.env.CHANNEL_ID_DISCORD
        this.client.on('ready', () => {
            console.log(`logged is at ${this.client.user.tag}!`)
        })
        this.client.login(process.env.TOKEN_DISCORD)

    }
    sendToMessage(message = 'message') {
        const channel = this.client.channels.cache.get(this.channelId)
        if (!channel) {
            console.error(`Coudn't find a channel...`, this.channelId)
            return
        }
        channel.send(message).catch(e => console.log(e))
    }
}

// const loggerService = new LoggerService()

export default new LoggerService()