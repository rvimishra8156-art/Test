import { useState } from "react";
import config from "../config.json";

export default function Header({ onSearch }) {
  const [q, setQ] = useState("");
  function handleChange(e) {
    setQ(e.target.value);
    onSearch && onSearch(e.target.value);
  }
  return (
    <header className="site-header">
      <div className="topline">
        <div className="email">✉️ {config.company.email}</div>
        <div className="phone">📞 {config.company.phone}</div>
      </div>
      <div className="nav">
        <div className="brand">
          <div className="logo">{config.company.name}</div>
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