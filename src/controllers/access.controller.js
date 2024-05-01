'use strict'
import { default as AccessService, default as accessService } from "../services/access.service.js";
import { CREATED, SuccessResponse } from './../core/success.response.js';

export default new class AccessController {
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
            metadata: await accessService.signUp(req.body)
        }).send(res)
    }
}
