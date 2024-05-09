'use strict'
import { default as AccessService } from "../services/access.service.js";
import { CREATED, SuccessResponse } from './../core/success.response.js';

export default new class AccessController {
    handleRefreshToken = async (req, res, next) => {
    //     new SuccessResponse({
    //        message: 'Get token Success OK!',
    //        metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    //    }).send(res)

    // v2 fixed
        new SuccessResponse({
           message: 'Get token Success OK!',
           metadata: await AccessService.handleRefreshTokenV2({
            refreshToken: req.refreshToken,
            user: req.user,
            keyStore: req.keyStore
           })
       }).send(res)
   }
    logout = async (req, res, next) => {
         new SuccessResponse({
            message: 'Logged out OK!',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
    login = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}
