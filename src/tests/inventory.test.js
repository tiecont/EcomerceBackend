import redisPubsubService from "../services/redisPubsub.service.js"

export default new class InventoryServiceTest {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message ) => {
            console.log('Received message: ', message)
            InventoryServiceTest.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Updated inventory ${productId} with quantity ${quantity}`)
    }
}