'use strict'
import mongoose from 'mongoose';

const uri = 'mongodb://localhost:27017/backend-ecommerce';

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
const connect = () => {
    mongoose.connect(uri, options)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log(err))
}
// dev
if (1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', {color: true})
}

export default connect