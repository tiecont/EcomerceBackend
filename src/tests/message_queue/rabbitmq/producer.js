import amqplib from 'amqplib';

const message = 'Hello, RabbitMQ for ShopDEV';

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:tiecont_2k2@localhost');
        const channel = await connection.createChannel();
        const queueName = 'test-topic';

        await channel.assertQueue(queueName, {
            durable: true
        });
        // Send messages to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`Message sent: `, message);

        // Close the channel and connection after sending the message
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error(error);
    }
};

runProducer().catch(console.error);
