'use strict'
import amqplib from 'amqplib';

async function consumerOrderedMessage() {
    const connection = await amqplib.connect('amqp://guest:tiecont_2k2@localhost');
    const channel = await connection.createChannel();
    const queueName = 'ordered-queued-message';

    await channel.assertQueue(queueName, {
        durable: true
    });

    for (let i = 0; i < 10; i++) {
        const message = `ordered-queued-message::${i}`
        console.log(`message: ${message}`)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }
    setTimeout(() => {
        connection.close();
        process.exit(0);
    }, 1000)
}


consumerOrderedMessage().catch(err => console.error(err));