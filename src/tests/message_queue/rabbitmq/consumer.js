import amqplib from 'amqplib';

const runConsumer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:tiecont_2k2@localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic';

        await channel.assertQueue(queueName, {
            durable: true
        });

        // Consume messages from the queue
        channel.consume(queueName, message => {
            if (message !== null) {
                console.log(`Received ${message.content.toString()}`);
                channel.ack(message); // Acknowledge the message
            }
        }, {
            noAck: false // Setting to false to ensure the message is acknowledged manually
        });

        console.log('Consumer is running...');
    } catch (error) {
        console.error(error);
    }
};

runConsumer().catch(console.error);
