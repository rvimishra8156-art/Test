import React from "react";

export default function Footer({ config }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>{config.name}</strong> — {config.tagline}
      </div>
      <div>© {new Date().getFullYear()} {config.name}. All rights reserved.</div>
    </footer>
  );
}