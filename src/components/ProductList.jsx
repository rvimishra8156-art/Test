import React, { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductList({ products, onOpen, itemsPerPage = 9 }) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, Math.ceil(products.length / itemsPerPage));
  const start = (page - 1) * itemsPerPage;
  const slice = products.slice(start, start + itemsPerPage);

  return (
    <div className="product-list">
      <div className="grid">
        {slice.map((p) => (
          <ProductCard key={p.id} product={p} onOpen={() => onOpen(p)} />
        ))}
      </div>

      <div className="pagination" role="navigation" aria-label="Pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        {[...Array(total)].map((_, i) => (
          <button
            aria-current={page === i + 1 ? "page" : undefined}
            key={i}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button disabled={page === total} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}