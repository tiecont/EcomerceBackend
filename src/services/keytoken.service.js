'use strict'
import keyTokenModel from '../models/keytoken.model.js'
class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey, privateKey }) => {
        try {
            // const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userID,
                publicKey,  //publicKeyString
                privateKey
            })

            return tokens ? publicKey : null
        } catch (error) {
            return error
        }
    }
}
export default KeyTokenService