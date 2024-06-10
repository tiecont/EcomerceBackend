import redisPubsubService from "../services/redisPubsub.service.js"

export default new class ProductServiceTest {
    purchaseProduct( productId, quantity) {
        const order = {
            productId,
            quantity
        }
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}