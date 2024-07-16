'use strict'
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    db: {
        host: process.env.DEV_HOST,
        port: process.env.DEV_PORT,
        name: process.env.DEV_DB_NAME,
    }
}

const prod = {
    app: {
        port: process.env.PROD_APP_PORT || 3000
    },
    db: {
        host: process.env.PROD_HOST,
        port: process.env.PROD_PORT,
        name: process.env.PROD_DB_NAME,
    }
}
const config = { dev, prod }
const env = process.env.NODE_ENV || 'dev'
export default config[env]