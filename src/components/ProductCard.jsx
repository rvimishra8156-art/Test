import React from "react";

function whatsappLink(product) {
  const phone = "919711842097";
  const text = `Hi, I'm interested in the product: ${product.name} (SKU:${product.sku})`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export default function ProductCard({ product, onOpen }) {
  return (
    <article className="product-card">
      <button className="image-btn" onClick={onOpen} aria-label={`Open ${product.name}`}>
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </button>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="price">
          {product.price_min} - {product.price_max} RS
        </p>
        <div className="actions">
          <a
            className="whatsapp"
            href={whatsappLink(product)}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp about ${product.name}`}
          >
            💬 WhatsApp
          </a>
          <button onClick={onOpen}>View</button>
        </div>
      </div>
    </article>
  );
}