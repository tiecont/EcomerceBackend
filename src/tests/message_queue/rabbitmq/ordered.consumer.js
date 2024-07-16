'use strict';
import amqplib from 'amqplib';

async function consumerOrderedMessage() {
    try {
        const connection = await amqplib.connect('amqp://guest:tiecont_2k2@localhost');
        const channel = await connection.createChannel();
        const queueName = 'ordered-queued-message';

        await channel.assertQueue(queueName, {
            durable: true
        });

        // Set prefetch to 1 to ensure only one ack at a time
        channel.prefetch(1)

        channel.consume(queueName, msg => {
            if (msg !== null) {
                const message = msg.content.toString();
                setTimeout(() => {
                    console.log('Processed message:', message);
                    channel.ack(msg);
                }, Math.random() * 1000);
            } else {
                console.log('Consumer cancelled by server');
            }
        }, {
            noAck: false
        });
    } catch (error) {
        console.error('Error in consumer:', error);
    }
}

consumerOrderedMessage().catch(err => console.error(err));
