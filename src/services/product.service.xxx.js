'use strict'
import { BadRequestError } from '../core/error.response.js';
import { ClothingSchema, ElectronicSchema, FurnitureSchema, ProductSchema } from '../models/product.model.js';
import { insertInventory } from '../models/repositories/inventory.repo.js';
import { findAllDraftForShop, findAllProducts, findAllPublishForShop, findProduct, publishProductByShop, unPublishProductByShop, updateProductById } from '../models/repositories/product.repo.js';
import Notification from '../services/notification.service.js';
import { removeUndefinedOject, updateNestedObjectParser } from '../utils/index.js';
import { searchProductByUser } from './../models/repositories/product.repo.js';
// define factory class to create product
class ProductFactory {
    /*
        type: 'Clothing,
        payload
    */
    static productRegistry = { }  // key-class

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct( type, payload ) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Inavlid Product Types ${type}`)
        return new productClass(payload).createProduct()
    }
    static async updateProduct( type, product_id, payload ) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Inavlid Product Types ${type}`)
        return new productClass(payload).updateProduct({product_id})
    }
    // PUT //
    static async publishProductByShop({ product_shop, product_id}) {
        return await publishProductByShop({ product_shop, product_id})
    }
    // END PUT //
    static async unPublishProductByShop({ product_shop, product_id}) {
        return await unPublishProductByShop({ product_shop, product_id})
    }
    // Query //
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip})
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0}) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip})
    }
    static async searchProducts({keySearch}) {
        return await searchProductByUser({keySearch})
    }
    static async findAllProducts ({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true}}) {
        return await findAllProducts({ limit, sort, filter, page, 
            select: ['product_name', 'product_price', 'product_thumb', 'product_shop']
        })
    }
    static async findProduct ({ productId }) {
        return await findProduct({ productId, unSelect: ['__v']})
    }
}
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    async createProduct( product_id){
        const newProduct = await ProductSchema.create({ ...this, _id: product_id})
        if (newProduct) {
            // add product_stock vào inventory collection
            await insertInventory({ 
                product_id: newProduct._id,
                shop_id: this.product_shop,
                stock: this.product_quantity
            })
            // push noti to system
            Notification.pushNotiToSystem({
                type: 'SHOP-001',
                received: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then(rs => console.log(rs)).catch(err => console.log(err))
        }
        return newProduct
    }

    // update product
    async updateProduct(product_id, bodyUpdate) {
        return await updateProductById({product_id, bodyUpdate, model: ProductSchema})
    }
}

// create sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct(){
        const newClothing = await ClothingSchema.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new Clothing Error')
        
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new Product Error')
        
        return newProduct
    }

    async updateProduct({product_id}) {
        // 1. Remove attrivbutes have null and undefined
        const objParams = removeUndefinedOject(this)
        if (objParams.product_attributes) {
            // update child
            await updateProductById({ product_id, 
                bodyUpdate: updateNestedObjectParser(objParams.product_attributes),
                model: ClothingSchema})
        }
        return await super.updateProduct(product_id, updateNestedObjectParser(objParams))
        
    }
}

// create sub-class for different product types Clothing
class Electronic extends Product {
    async createProduct(){
        const newElectronic = await ElectronicSchema.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Electronics Error')
        
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new Product Error')
        
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct(){
        const newFurniture = await FurnitureSchema.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new newFurniture Error')
        
        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new Product Error')
        
        return newProduct
    }
}

// Register Product Types
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

export default ProductFactory