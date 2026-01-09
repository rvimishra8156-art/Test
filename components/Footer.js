import config from "../config.json";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <strong>{config.company.name}</strong> — {config.company.tagline}
      </div>
      <div>© {new Date().getFullYear()} {config.company.name}. All rights reserved.</div>
    </footer>
  );
}