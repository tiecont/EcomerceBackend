'use strict'

import mongoose from 'mongoose';
import configENV from '../configs/config.mongodb.js';
import CheckConnect from '../helpers/check.connect.js';

const { port, host, name} = configENV.db
const uri = `mongodb://${host}:${port}/${name}`;
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}
// dev
class database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(uri, options)
        .then(() => {
            console.log(`Connected to database`), CheckConnect.countConnections()
        })
        .catch((err) => console.log(err))
    }
    
    static getInstance() {
        if (!this.instance) {
            this.instance = new database()
        }
        return this.instance
    }
}

const instanceMongodb = database.getInstance()

export default instanceMongodb