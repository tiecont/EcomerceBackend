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
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) })
    } 
    static removeTokenById = async ({ id }) => {
        const result = await keyTokenModel.deleteOne({
            _id:  new Types.ObjectId(id)
        })
        return result;
    }
    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshTokenUsed: refreshToken}).lean()
    }
    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken })
    }
    static deleteKeyById = async (userId) => {
        return await keyTokenModel.findByIdAndDelete({ _id: userId })
    }
}