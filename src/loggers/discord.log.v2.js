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
    sendToFormatCode(logdata) {
        const { code, message = 'This is some additional information about the code.', title = 'Code Example' } = logdata
        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```'
                }
            ]
        }
        this.sendToMessage(codeMessage)
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