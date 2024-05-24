'use strict';
import { Schema, model } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

// Define the Product schema
const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronic', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, requred: true },
    product_ratingsAverage: {
        type: Number,
        required: true,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text'})
// Document middleware: run before .save() and .create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

// Define the Clothing schema
const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    materials: String
}, {
    collection: 'clothes',
    timestamps: true
});

// Define the Electronic schema
const electronicSchema = new Schema({
    manufacturer: { type: String, required: true },
    model: String,
    color: String
}, {
    collection: 'electronics',
    timestamps: true
});

// Define the Furniture schema
const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    materials: String
}, {
    collection: 'furnitures',
    timestamps: true
});

// Export the models
export const ProductSchema = model(DOCUMENT_NAME, productSchema);
export const ClothingSchema = model('Clothing', clothingSchema);
export const ElectronicSchema = model('Electronic', electronicSchema);
export const FurnitureSchema = model('Furniture', furnitureSchema);
