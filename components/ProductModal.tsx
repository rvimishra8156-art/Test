import React, { useEffect, useState } from "react";
import { Product } from "../types";

interface ProductModalProps {
    product: Product;
    onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onClose]);

    // Reset index when product changes
    useEffect(() => {
        setIndex(0);
    }, [product]);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
                <div className="modal-body">
                    <div className="gallery">
                        {/* Main Image with aspect ratio prevention */}
                        <div style={{ aspectRatio: '4/3', width: '100%', overflow: 'hidden', borderRadius: '8px' }}>
                            <img
                                className="main"
                                src={product.images[index]}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>

                        <div className="thumbs">
                            {Array.isArray(product.images) && product.images.map((src, i) => (
                                <button
                                    key={i}
                                    className={`thumb ${i === index ? "active" : ""}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`View angle ${i + 1}`}
                                >
                                    <img src={src} alt={`${product.name} ${i + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="details">
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <div className="tags">
                            {product.tags.map(t => <span key={t} className="tag">#{t}</span>)}
                        </div>
                        <p className="price">Price: ₹{product.price_min} - ₹{product.price_max}</p>
                        <p className="stock-status" style={{ color: product.stock > 0 ? 'green' : 'red' }}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                        </p>
                        <a
                            className="whatsapp large"
                            href={`https://wa.me/919711842097?text=${encodeURIComponent(`Hi, I'm interested in the product: ${product.name} (SKU:${product.sku})`)}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Contact on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
