'use strict'
import accessService from "../services/access.service.js";
import { CREATED } from './../core/success.response.js';

export default new class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await accessService.signUp(req.body)
        }).send(res)
    }
}
