'use strict'

class AccessController {
    signUp = async (req, res, next) => {
        try {
            console.log(`[P]::signUp::`, req.body)
            res.status(201).json({
                code: '20001',
                metadata: {userID: 1}
            })
        } catch (error) {
            next(error);
        }
    }
}

export default new AccessController