import productsData from '../data/products.json';
import { z } from 'zod';
import { Product } from '../types';

// AOP: Define the Schema Validation Aspect
const ProductSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    // Defensive: Force images to be array, or fallback if possible (but we mostly wan't to catch bad data)
    images: z.array(z.string()).min(1, "Product must have at least one image"),
    price_min: z.number(),
    price_max: z.number(),
    tags: z.array(z.string()),
    category: z.string(),
    sku: z.string(),
    stock: z.number(),
    featured: z.boolean(),
});

export const getProducts = (): Product[] => {
    // AOP: Intercept access to validate data
    const result = z.array(ProductSchema).safeParse(productsData);

    if (!result.success) {
        console.error("DATA VALIDATION ERROR:", result.error);
        // In production, we might want to filter out bad products instead of crashing
        // For now, let's return [] or throw to be explicit during build
        throw new Error("Product data corrupted. See console.");
    }

    return result.data as Product[];
};

export const getFeaturedProducts = (): Product[] => {
    const products = getProducts();
    return products.filter(p => p.featured);
};
