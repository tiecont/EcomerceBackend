'use strict'

import { Client, GatewayIntentBits } from "discord.js"

const client = new Client({
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// client.on('ready', () => {
//     console.log(`logged is at ${client.user.tag}!`)
// })

// const token = 'MTI0ODQ2OTQzMTI2NTUyNTg0Mw.GfM905.usc9WsqK8SKob2FE7iYUYu4RYrcvW9L7HnjL_w'
// client.login(token)

// client.on('messageCreate', msg => {
//     if (msg.author.bot) return
//     if (msg.content === 'hello') {
//         msg.reply('Hello! How can i assits you today?')
//     }
// })