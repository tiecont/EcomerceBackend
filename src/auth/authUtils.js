'use strict'
import JWT from 'jsonwebtoken'
const createTokenPair = async (payload, publicKey, privateKey) => {
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

export default createTokenPair