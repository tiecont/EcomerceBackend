import amqplib from 'amqplib';
const messages = ''

// const log = console.log
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments))
// }
const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:tiecont_2k2@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'NotificationEx' // notificationEx direct
        const notiQueue = 'NotificationQueue' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notificationEx direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert

        // 1. Create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        });
        // 2. Create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phép các kết nối truy cập vào cùng một lúc hàng đợi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        // 3. Bind Queue
        await channel.bindQueue(queueResult.queue, notificationExchange)
        // 4. Send Message
        const msg = 'A new product has been created'
        console.log(`Producer msg:: `, msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500)
    } catch (error) {
        console.error(`error:: `, error)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)