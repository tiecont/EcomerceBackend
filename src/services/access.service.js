'use strict'

import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import createTokenPair from '../auth/authUtils.js'
import { BadRequestError } from '../core/error.response.js'
import shopModel from "../models/shop.model.js"
import KeytokenService from '../services/keytoken.service.js'
import getInfoData from '../utils/index.js'
const RuleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
export default class AccessService {
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
