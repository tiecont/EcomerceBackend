'use strict'
import JWT from 'jsonwebtoken';
import { AuthFailureError, NotFoundError } from '../core/error.response.js';
import KeyTokenService from '../services/keytoken.service.js';
import { asyncHandler } from './../helpers/asyncHandler.js';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

export const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // AccessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days'
        }) 
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days'
        })
        // 
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.error('error verifying', err)
            } else {
                console.log('decode verified', decode)
            }
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        return error
    }
}
export const authentication = asyncHandler( async (req, res, next) => {
    /*
        1 - check userId missing?
        2 - get accessToken
        3 - verifyToken
        4 - check user in dbs
        5 - check keyStore with this userId
        6 - OK all => return next()
    */
   const userId = req.headers[HEADER.CLIENT_ID]
   if (!userId) throw new AuthFailureError('Invalid Request')

   // 2
   const keyStore = await KeyTokenService.findByUserId( userId )
   if (!keyStore) throw new NotFoundError('Not Found KeyStore')

   // 3
   const accessToken = req.headers[HEADER.AUTHORIZATION]
   if (!accessToken) throw new AuthFailureError('Invalid Request')
   try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId != decodeUser.userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
   } catch (error) {
        throw error
   }
   // 4
   return next()
})

export const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

