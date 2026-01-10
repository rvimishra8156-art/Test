import React from 'react';
import { Product } from '../types';
import config from '../config.json';

import Image from 'next/image';

interface ProductCardProps {
    product: Product;
    onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
    // Safe WhatsApp link generator
    const getWhatsAppLink = (name: string, sku: string) => {
        const phone = config.company.whatsapp_international;
        const text = `Hi, I'm interested in the product: ${name} (SKU:${sku})`;
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    return (
        <div className="product-card">
            <div className="product-image" onClick={() => onClick(product)}>
                {/* Defensive check for images array is now guaranteed by Zod at data layer, but good to keep safe */}
                <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    unoptimized
                />
            </div>
            <div className="product-body">
                <h3>{product.name}</h3>
                <p className="price">₹{product.price_min} - ₹{product.price_max}</p>
                <div className="actions">
                    <button className="btn-details" onClick={() => onClick(product)}>View</button>
                    <a
                        href={getWhatsAppLink(product.name, product.sku)}
                        className="btn-whatsapp"
                        target="_blank"
                        rel="noreferrer"
                    >
                        WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
