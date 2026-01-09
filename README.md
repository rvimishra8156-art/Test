```markdown
# Pluss Wood — Premium Wooden Products (GitHub Pages-ready Next.js export)

Pluss Wood — Craft-led premium wooden products site (static export for GitHub Pages).

What this repo contains
- Next.js site configured for Static Site Generation (SSG) using `getStaticProps`.
- 40 curated product items in `data/products.json`.
- All product images included as SVG placeholders under `public/images/` (replace them with final images later).
- AI prompts for generating product hero images and 3 logo prompts under `public/ai-prompts/`.
- GitHub Actions workflow to:
  - Build & export static site (next export -> out/)
  - Run Lighthouse CI checks against the exported site
  - Deploy the exported `out/` to `gh-pages` branch for GitHub Pages publishing
- Contact page wired to EmailJS (configure `config.json.emailjs`)

Quick start (local)
1. Install Node 18+ and npm
2. Install dependencies:
   - npm install
3. Run development server:
   - npm run dev
4. Build & export to static:
   - npm run export
5. Local preview of exported static site:
   - npx http-server out -p 8080
   - open http://localhost:8080

Deploy to GitHub Pages (automated)
- After pushing to `main`, the workflow `.github/workflows/deploy.yml` will run, build the site, run Lighthouse checks, and push `out/` to `gh-pages`. Configure Pages to serve from `gh-pages` branch (root).

Notes & next steps
- Replace the SVG placeholders in `public/images/` with high-resolution AI-generated or photographed images.
- Use the prompts in `public/ai-prompts/` to generate premium imagery using Midjourney / DALL·E / SDXL.
- Update `config.json.emailjs` with your EmailJS service ID/template/public key to enable contact form emailing.
- For production performance, consider CDN-hosted images (Cloudinary, S3 + CloudFront) and use compressed WebP/AVIF images.
```