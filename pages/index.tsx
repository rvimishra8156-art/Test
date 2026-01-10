import Head from "next/head";
import { useState } from "react";
import { GetStaticProps } from "next";
import ProductList from "../components/ProductList";
import ProductModal from "../components/ProductModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getProducts } from "../lib/data";
import { Product } from "../types";
import config from "../config.json";

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
                <title>{config.seo.site_title}</title>
                <meta
                    name="description"
                    content={config.seo.site_description}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* Shared Header with Top Bar */}
            <Header onSearch={setSearch} />

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

            <Footer />

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
