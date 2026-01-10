import { useEffect, useState } from "react";

export default function ProductModal({ product, onClose }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="modal-body">
          <div className="gallery">
            <img className="main" src={product.images[index]} alt={product.name} />
            <div className="thumbs">
              {Array.isArray(product.images) && product.images.map((src, i) => (
                <button key={i} className={`thumb ${i === index ? "active" : ""}`} onClick={() => setIndex(i)} aria-label={`View angle ${i + 1}`}>
                  <img src={src} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="details">
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p className="price">Price: {product.price_min} - {product.price_max} RS</p>
            <a className="whatsapp large" href={`https://wa.me/919711842097?text=${encodeURIComponent(`Hi, I'm interested in the product: ${product.name} (SKU:${product.sku})`)}`} target="_blank" rel="noreferrer">Contact on WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  );
}