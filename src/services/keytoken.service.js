'use strict'
import keyTokenModel from '../models/keytoken.model.js'
class KeyTokenService {
    static createKeyToken = async ({ userID, publicKey }) => {
        try {
            const publicKeyString = publicKey.toString()
            const tokens = await keyTokenModel.create({
                user: userID,
                publicKey: publicKeyString
            })

            return tokens ? publicKeyString : null
        } catch (error) {
            return error
        }
    }
}
export default KeyTokenService