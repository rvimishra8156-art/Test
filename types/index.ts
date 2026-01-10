export interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    price_min: number;
    price_max: number;
    tags: string[];
    category: string;
    sku: string;
    stock: number;
    featured: boolean;
}
