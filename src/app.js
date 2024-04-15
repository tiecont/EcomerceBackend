
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

// init db
import './dps/init.mongodb.js';
import checkConnect from './helpers/check.connect.js';
import router from './routes/index.js';
checkConnect.checkOverLoad()
// init routes
app.use('/', router)
// handling errors


export default app