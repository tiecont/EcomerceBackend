'use strict'

import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { createTokenPair } from '../auth/authUtils.js'
import { AuthFailureError, BadRequestError } from '../core/error.response.js'
import shopModel from "../models/shop.model.js"
import KeytokenService from '../services/keytoken.service.js'
import getInfoData from '../utils/index.js'
import findByEmail from './shop.service.js'
const RuleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
export default class AccessService {
    static logout = async (keyStore) => {
        return delKey = await KeytokenService.removeKeyById(keyStore._id)
    }
    static login = async ({ email, password, refreshToken = null}) => {
        /*
            1 - check email in dbs
            2 - match password
            3 - create AT vs RT and save
            4 - generate tokens
            5 - get data and return login
        */
        // 1
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new BadRequestError('Error: Shop not registered!')
        // 2
        const match = bcrypt.compare( password, foundShop.password)
        if (!match) throw new AuthFailureError('Authentication Error')
        // 3
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        // 4
        const { _id: userId } = foundShop
        const tokens = await createTokenPair({ userId, email}, publicKey, privateKey)
        await KeytokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey, publicKey, userId
        })
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop}),
            tokens
        }
    }

    static signUp = async ({ name, email, password}) => {
        // try {
            //step1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered!')
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RuleShop.SHOP]
            })
            if (newShop) {
                // Created privateKey, publicKey
                // const {privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', // pkcs8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type:'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')
                console.log({ privateKey, publicKey})


                const keyStore = await KeytokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
                }
                // create token pair
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success: ', tokens)
                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }
        // } catch (error) {
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
        // }
    }
}
