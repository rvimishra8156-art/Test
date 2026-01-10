import Head from "next/head";
import { useState } from "react";
import { GetStaticProps } from "next";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";
import { getProducts } from "../lib/data";
import { Product } from "../types";

interface HomeProps {
    products: Product[];
}

export default function Home({ products }: HomeProps) {
    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Filter products based on search (Name or Tags)
    const filtered = products.filter((p) => {
        const term = search.toLowerCase();
        return (
            p.name.toLowerCase().includes(term) ||
            p.tags.some((t) => t.toLowerCase().includes(term))
        );
    });

    return (
        <>
            <Head>
                <title>Pluss Wood | Premium Handcrafted Furniture</title>
                <meta
                    name="description"
                    content="Premium wooden furniture and accessories for modern homes."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <header className="site-header">
                <div className="container">
                    <div className="logo">
                        <h1>Pluss Wood</h1>
                    </div>
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search"
                        />
                    </div>
                </div>
            </header>

            <main className="container main-content">
                <div className="hero">
                    <h2>Handcrafted Elegance</h2>
                    <p>Explore our curated collection of premium wooden artifacts.</p>
                </div>

                <ProductList
                    products={filtered}
                    onProductClick={setSelectedProduct}
                />
            </main>

            <footer className="site-footer">
                <p>© {new Date().getFullYear()} Pluss Wood. All rights reserved.</p>
            </footer>

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}

// AOP: Data Access Layer usage
// This ensures that during build time (Static Export), we validate all data.
export const getStaticProps: GetStaticProps = async () => {
    try {
        const products = getProducts();
        return {
            props: {
                products,
            },
        };
    } catch (error) {
        console.error("Build failed due to data validation error:", error);
        throw error; // Fail the build intentionally if data is bad
    }
};
