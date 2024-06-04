
import compression from 'compression';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express()
// init middleware
app.use(morgan())
// compile - common - short - tiny
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
import './dps/init.mongodb.js';
import router from './routes/index.js';
// import checkConnect from './helpers/check.connect.js';
// checkConnect.checkOverLoad()
// init routes
app.use('/', router)

// handling errors
app.use((req, res, next) => {
    // middleware
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })

})

export default app