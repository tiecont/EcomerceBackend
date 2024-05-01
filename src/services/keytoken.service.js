'use strict'
import { Types } from 'mongoose'
import keyTokenModel from '../models/keytoken.model.js'
export default class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const publicKeyString = publicKey.toString()
            // const tokens = await keyTokenModel.create({
            //     user: userID,
            //     publicKey,  //publicKeyString
            //     privateKey
            // })

            // return tokens ? publicKey : null

            // level xx
            const filter  = { user: userId }, update = { 
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }, options = {
                upsert: true,
                new: true
            }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
    static findByUserId = async ( userId ) => {
        return await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean()
    } 
    static removeKeyById = async (id) => {
        return await keyTokenModel.remove(id)
    }
}