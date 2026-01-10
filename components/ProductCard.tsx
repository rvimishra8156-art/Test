import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    // Safe WhatsApp link generator
    const getWhatsAppLink = (name: string, sku: string) => {
        const text = `Hi, I'm interested in the product: ${name} (SKU:${sku})`;
        return `https://wa.me/919711842097?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="product-card">
            <div className="image-container" onClick={() => onClick(product)}>
                {/* Defensive check for images array is now guaranteed by Zod at data layer, but good to keep safe */}
                <img
                    src={product.images[0]}
                    alt={product.name}
                    loading="lazy"
                    width="400"
                    height="300"
                    style={{ objectFit: 'cover', width: '100%', aspectRatio: '4/3' }}
                />
            </div>
            <div className="info">
                <h3>{product.name}</h3>
                <p className="price">₹{product.price_min} - ₹{product.price_max}</p>
                <div className="actions">
                    <button className="btn-details" onClick={() => onClick(product)}>View Details</button>
                    <a
                        href={getWhatsAppLink(product.name, product.sku)}
                        className="btn-whatsapp"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Buy on WP
                    </a>
                </div>
            </div>
        </div>
    );
}
