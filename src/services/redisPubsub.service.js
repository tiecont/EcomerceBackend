import redis from "redis";
export default new class RedisPubSubService {
    constructor(){
        this.subscriber = redis.createClient()
        this.publisher = redis.createClient()
    }

    publish(channel, message) {
        return new Promise(( resovle, reject) => {
            this.publisher.publish(channel, message, (err, reply) => {
                if (err) {
                    reject(err)
                }
                resovle(reply)
            })
        })
    }
    subscribe(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message)
            }
        })
    }
}