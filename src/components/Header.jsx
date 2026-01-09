import React, { useState } from "react";

export default function Header({ onSearch, config }) {
  const [q, setQ] = useState("");
  function handleChange(e) {
    setQ(e.target.value);
    onSearch(e.target.value);
  }
  return (
    <header className="site-header">
      <div className="topline">
        <div className="email">✉️ {config.email}</div>
        <div className="phone">📞 {config.phone}</div>
      </div>
      <div className="nav">
        <div className="brand">
          <div className="logo">Pluss Wood</div>
        </div>
        <div className="search">
          <input
            aria-label="Search products"
            placeholder="Search products, tags, description..."
            value={q}
            onChange={handleChange}
          />
        </div>
      </div>
    </header>
  );
}