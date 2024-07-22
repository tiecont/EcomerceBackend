'use strict'

import cloudinary from "../configs/cloudinary.config.js"


// 1. Upload from url image
export const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://files.yande.re/image/c4098ea9155c93cc98eaa662d3c4f0df/yande.re%201184125%20bikini%20garter%20heaven_burns_red%20kani_biimu%20kunimi_tama%20neko%20swimsuits%20wallpaper.jpg'
        const folderName = 'product/shopId', newFileName = 'testDemoUploadImage'

        const result = await cloudinary.uploader.upload(urlImage, {
            // public_id: newFileName,
            folder: folderName
        })
        return result
    } catch (error) {
        console.error(error)
    }
}

uploadImageFromUrl().catch()