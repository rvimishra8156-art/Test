import React, { useState, useMemo } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductModal from "./components/ProductModal";
import productsData from "./data/products";
import config from "../config.json";

export default function App() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productsData;
    return productsData.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.tags.join(" ").toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <div className="app">
      <Header onSearch={setQuery} config={config.company} />
      <main>
        <section className="hero">
          <div className="hero-inner">
            <h1>{config.company.tagline}</h1>
            <p>Handcrafted wooden goods for your home & office.</p>
          </div>
        </section>

        <section className="products-section">
          <ProductList
            products={filtered}
            onOpen={(p) => setSelected(p)}
            itemsPerPage={config.company.default_items_per_page}
          />
        </section>
      </main>

      <Footer config={config.company} />

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}