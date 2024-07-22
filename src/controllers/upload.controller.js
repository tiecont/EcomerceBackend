'use strict'

import { SuccessResponse } from "../core/success.response"
import { uploadImageFromUrl } from "../services/upload.service"

export default new class UploadController {
    uploadFile = async (req, res, next) => {
        new SuccessResponse({
            message: "File uploaded successfully",
            metadata: await uploadImageFromUrl()
        }).send(res)
    }
}