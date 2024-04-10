
import compression from 'compression';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
const app = express()
// init middleware
dotenv.config();
app.use(morgan())
// compile - common - short - tiny
app.use(helmet())
app.use(compression())

// init db
import './dps/init.mongodb.js';
import checkConnect from './helpers/check.connect.js';
checkConnect.checkOverLoad()
// init routes
app.get('/', (req, res, next) => {
    const strCompress = 'Hello baby, '
    return res.status(200).json({
        message: 'wellcome',
        metadata: strCompress.repeat(100000)
    })
})

// handling errors


export default app