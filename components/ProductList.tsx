import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductListProps {
    products: Product[];
    onProductClick: (product: Product) => void;
    itemsPerPage?: number;
}

export default function ProductList({ products, onProductClick, itemsPerPage = 9 }: ProductListProps) {
    const [page, setPage] = useState(1);

    if (!products || products.length === 0) {
        return <div className="no-products">No products found matching your criteria.</div>;
    }

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const currentProducts = products.slice(start, start + itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            // Scroll to top of list
            document.querySelector('.products-section')?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="product-list-container">
            <div className="grid">
                {currentProducts.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onClick={onProductClick}
                    />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination" role="navigation" aria-label="Pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => handlePageChange(page - 1)}
                        aria-label="Previous Page"
                    >
                        &larr; Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={page === i + 1 ? 'active' : ''}
                            aria-current={page === i + 1 ? "page" : undefined}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={page === totalPages}
                        onClick={() => handlePageChange(page + 1)}
                        aria-label="Next Page"
                    >
                        Next &rarr;
                    </button>
                </div>
            )}
        </div>
    );
}
