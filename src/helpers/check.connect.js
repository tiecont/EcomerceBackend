'use strict'
import { mongoose } from 'mongoose';
import os from 'os';
import process from 'process';
const _SECONDS = 5000;
export default new class CheckConnection {
    countConnections() {
        const numConnections = mongoose.connections.length
        console.log(`Numbers of connections: ${numConnections}`)
    }
    checkOverLoad() {
        setInterval(() => {
            const numConnections = mongoose.connections.length
            const numCores = os.cpus().length
            const memoryUsage = process.memoryUsage().rss

            const maxConnections = numCores * 5
            console.log(`
                Active connections: ${numConnections}
                Memory Usage: ${memoryUsage / 1024 / 1024} MB
            `)
            if (numConnections > maxConnections) {
                console.log(`Max connections reached: ${maxConnections}`)
                process.exit(1)
            }
        }, _SECONDS)
    }
}