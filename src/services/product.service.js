'use strict'
import { BadRequestError } from './../core/error.response.js';
import { clothingSchema, electronicSchema, productSchema } from './../models/product.model.js';

// define factory class to create product
class ProductFactory {
    /*
        type: 'Clothing,
        payload
    */
    static async createProduct( type, payload ) {
        switch (type) {
            case 'Electronics':
                return new Electronic(payload).createProduct()
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default: 
                throw new BadRequestError(`Invalid Product Type: ${type}`)
        }

    }
}

// define basic product class 
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
        return await productSchema.create({ ...this, _id: product_id})
    }
}

// create sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct(){
        const newClothing = await clothingSchema.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new Clothing Error')
        
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new Product Error')
        
        return newProduct
    }
}

// create sub-class for different product types Clothing
class Electronic extends Product {
    async createProduct(){
        const newElectronic = await electronicSchema.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Electronics Error')
        
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new Product Error')
        
        return newProduct
    }
}

export default ProductFactory