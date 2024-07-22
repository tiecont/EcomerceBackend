'use strict'
import { v2 as cloudinary } from 'cloudinary';
// Return "https" URLs by setting secure: true
console.log(process.env.CLOUDINARY_API_SECRET)
cloudinary.config({
  cloud_name: 'shopties',
  api_key: '983164698369465',
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Log the configuration
// console.log(cloudinary.config());

export default cloudinary
