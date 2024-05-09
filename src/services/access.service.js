'use strict'

import bcrypt from 'bcrypt'
import crypto from 'node:crypto'
import { createTokenPair, verifyJWT } from '../auth/authUtils.js'
import { AuthFailureError, BadRequestError, ForBiddenError } from '../core/error.response.js'
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
    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore}) => {
        const { userId, email } = user
        if (keyStore.refreshTokenUsed.includes(refreshToken)) {
            await KeytokenService.deleteKeyById(userId)
            throw new ForBiddenError('Something is wrong. Pls relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered')
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Error: Shop not registered!')

            // create 1 cặp mới
            const tokens = await createTokenPair({userId, email}, keyStore.publicKey, keyStore.privateKey)
           
            // update token
            await keyStore.updateOne ({
                $set: {
                    refreshToken: tokens.refreshToken
                },
                $addToSet: {
                    refreshTokenUsed: refreshToken // đã được sử dụng để lấy token mới
                }
            })
            return {
                user,
                tokens
            }
    }
    static handleRefreshToken = async ( refreshToken ) => {
        /*
            check token used?
        */
        const foundToken = await KeytokenService.findByRefreshTokenUsed( refreshToken )
        if (foundToken) {
            // decode 
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            console.log({ userId, email})
            await KeytokenService.deleteKeyById(userId)
            throw new ForBiddenError('Something is wrong. Pls relogin')
        }

        const holderToken = await KeytokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not registered')
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
    
        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('Error: Shop not registered!')

        // create 1 cặp mới
        const tokens = await createTokenPair({userId, email}, holderToken.publicKey, holderToken.privateKey)
       
        // update token
        await holderToken.updateOne ({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken // đã được sử dụng để lấy token mới
            }
        })
        return {
            user: { userId, email},
            tokens
        }
    }
    static logout = async (keyStore) => {
        const delKey = await KeytokenService.removeTokenById(keyStore._id)
        return delKey
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
        const match = bcrypt.compare(password, foundShop.password)
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
