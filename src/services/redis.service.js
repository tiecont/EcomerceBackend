'use strict'

import { createClient } from "redis"
import { promisify } from 'util'
import { reservationInventory } from '../models/repositories/inventory.repo.js'
const redisClient = createClient()

redisClient.ping((err, result) => {
    if (err) {
        console.log('Redis is not connected: ', err)
    } else {
        console.log('Connected to Redis: ', result)
    }
})

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setNX).bind(redisClient)

// Khoá lạc quan - OPTIMISTIC LOCK
export const acquireLock = async ({ productId, quantity, cartId }) => {
    const key = `lock_v2024_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3 seconds lock

    for (let i = 0; i < retryTimes.length; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log(`result:::`, result)
        if (result === 1) {
            // thao tác với inventory
            const isReservation = await reservationInventory({ productId, quantity, cartId })
            if (isReservation.modifiedCount){
                await pExpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
        
    }
}

export const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}