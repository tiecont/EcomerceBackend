'use strict'

import crypto from 'crypto'
import createTokenPair from '../auth/authUtils.js'
import shopModel from "../models/shop.model.js"
import KeytokenService from '../services/keytoken.service.js'
const RuleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}
class AccessService {

    static signup = async ({ name, email, password}) => {
        try {
            //step1: check email exists?
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered!'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RuleShop.SHOP]
            })
            if (newShop) {
                // Created privateKey, publicKey
                const {privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096
                })
                console.log({ privateKey, publicKey})

                const publicKeyString = await KeytokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey
                })

                if (!publicKeyString) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }
                // create token pair
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey)
                console.log('Created Token Success: ', tokens)
                return {
                    code: '201',
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

export default AccessService