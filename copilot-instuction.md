## Copilot Instructions

Below is a complete deliverable you can copy/paste into an LLM (Copilot / ChatGPT / Anthropic / local model) or use yourself. It contains:
- A short marketing/promotional description of the app.
- A technical prompt for an LLM to build this app from scratch (repo structure, tech stack, commands).
- Image-generation prompts (realistic product hero images + logo prompts).
- A reusable checklist to verify the app at any time.
- A titled, compact requirements list (suitable for PO/PRD).
- Current status: what’s completed and what remains.
- Instructions to preserve theme (colors, fonts, roles) and where to keep them.
- Detailed next-step implementation prompts you can paste into IntelliJ Copilot / other LLMs to drive the exact changes.

Use whichever blocks you need. The “LLM prompts” are intentionally explicit so an assistant can act with minimal follow-up.

–––––––––––––––––––––––––
1) Marketing / Promo copy (short)
–––––––––––––––––––––––––
Pluss Wood — Premium Wooden Products
Pluss Wood is a handcrafted, craft-led e-commerce showcase that presents premium wooden furniture and home accessories using a fast, static Next.js export to GitHub Pages. Built for designers and small makers, the site highlights 40 curated products with elegant product pages, quick-search, modal product details, and a contact form. The repository is optimized for CI/CD: the GitHub Actions workflow builds and exports a static site, runs Lighthouse CI audits, and deploys to gh-pages — enabling an instant, low-cost public demo of your catalog.

Use this copy on a GitHub README, product pitch, or marketing snippet.

–––––––––––––––––––––––––
2) LLM technical prompt: Build this app from scratch
(Use for “build from scratch” or to bootstrap a repo)
–––––––––––––––––––––––––
System/Task:
You are an expert full-stack engineer. Create a GitHub-ready Next.js (v14) project that exports a static site (next export) for GitHub Pages. The site is a product catalog for “Pluss Wood” with 40 sample products, static images (placeholders), a contact page, and a GitHub Actions workflow that:
- builds and exports the site to out/,
- runs Lighthouse CI against the static out/,
- deploys out/ to the gh-pages branch using a repo secret GH_PAGES_PAT.

Constraints:
- Use Next.js static export (output: "export"). No server-side dynamic runtime features (no ISR/revalidate).
- Keep design simple, responsive, and accessible.
- Use CSS variables (in styles/globals.css) for theme colors and font sizes so they are editable in one place.
- Product data lives at data/products.json — each entry: id, name, price, description, tags, images: [] (paths under /images/).
- Provide a scripts/update-images.js to scan public/images and replace product images in data/products.json when generated JPG/WEBP files exist.

Deliverables (file list + brief content):
- package.json (scripts: dev, build, export, start)
- next.config.js (CommonJS, output: "export")
- pages/index.js (getStaticProps, product list, search)
- pages/contact.js (static contact form wiring to EmailJS config.json)
- components/Header.js, Footer.js, ProductCard.js, ProductList.js, ProductModal.js
- styles/globals.css (CSS variables: --color-primary, --color-accent, --text-color, --muted, font-sizes)
- data/products.json (40 sample product entries referencing /images/product-001.svg … product-040.svg)
- public/images/* (placeholder SVGs named product-001.svg … product-040.svg)
- public/ai-prompts/prompts_full.txt (40 image prompts) and logo_prompts.txt (3 logo prompts)
- scripts/update-images.js (Node 18+, ES module or CommonJS acceptable)
- .github/workflows/deploy.yml (two-stage: build+LHCI, deploy using peaceiris/actions-gh-pages + secret GH_PAGES_PAT)
- .lighthouseci.yml with thresholds

Commands to run locally / verify:
- npm install
- npm run dev (localhost:3000)
- npm run build && npm run export
- npx http-server out -p 8080 (preview static site)
- To deploy manually (if needed): git subtree push --prefix out origin gh-pages
- CI uses npm ci (requires package-lock.json)

Testing and checks:
- Lighthouse CI autorun should report performance/accessibility/best-practices.
- Contact form should read config.json/emailjs placeholders (do not check in real keys).

Extra: Provide README with usage and simple image-generation instructions.

–––––––––––––––––––––––––
3) Product image generation prompts (realistic)
(Use with Midjourney / DALL·E / SDXL / Stable Diffusion. Replace <product-name> and any material/finish specifics.)
–––––––––––––––––––––––––
General instructions for all prompts:
- Style: photorealistic product photography, natural studio lighting, soft shadows, shallow depth of field on a neutral background (light gray or warm wood-tone), 45-degree angle + front hero view, realistic material details and textures.
- Output: wide format (3:2 or 4:3), high resolution, no watermark.
- Post-processing: subtle vignetting, color-corrected, sharpness for wood grain.
- For web: generate JPG and WEBP at 1600px max width and optionally 800px thumbnail.

Example prompts (template):
1) Product hero — dining table
Prompt:
"Photorealistic studio photo of a handcrafted wooden dining table named '<product-name>', solid walnut with visible grain, satin finish, mid-century modern legs, warm natural light from the left, soft shadow, shallow depth of field, 3:2 aspect, 50mm lens look, ultra-detailed wood grain and joinery, neutral warm background — output high-res, no text, no watermark."

2) Product hero — side table (alternate)
Prompt:
"Close-up product shot of a handcrafted side table '<product-name>' in oak with matte finish, studio lighting, crisp detail of wood rings and joinery, minimal shadows, 4:3 aspect ratio, photorealistic, natural color balance, realistic reflections."

3) Lifestyle / context (optional)
Prompt:
"Interior scene showing '<product-name>' placed in a Scandinavian living room, natural morning light, soft rug, 35mm lens, cinematic color grade, photorealistic, emphasis on product scale."

Logo prompts (for generating 3 concept logos):
- "Minimal geometric logo for Pluss Wood: combines a stylized tree and wood grain in a single geometric mark, warm brown (#7A4B2A) primary, accent olive (#A6A36D), clean sans-serif wordmark 'Pluss Wood' to the right, scalable vector style, monochrome variant included."
- "Hand-drawn circular stamp-style logo with woodcut texture, 'Pluss Wood' wordmark, deep espresso color, subtle decorative lines, high contrast for engraving and label use."
- "Modern minimal monogram 'PW' with negative-space wood grain pattern, brand colors: #7A4B2A (primary), #F2EDE6 (background), deliver as SVG and PNG."

Naming & output:
- Save files named product-001.jpg, product-001-1.webp, product-002.jpg, etc.
- Keep path /public/images/ so update-images.js picks them up.

–––––––––––––––––––––––––
4) Requirements (titled)
(Short, clear requirement list suitable for copy into a ticket)
–––––––––––––––––––––––––
Title: Pluss Wood — Static Product Catalog (Requirements)

1. Tech stack: Next.js v14 (static export), Node 18+, GitHub Actions, Lighthouse CI.
2. Static export: site must be fully exportable via next export and deployable to GitHub Pages (gh-pages branch).
3. Data: product catalog stored in data/products.json (40 entries). Images under public/images/.
4. Search: client-side quick search over product name, tags, description.
5. Product detail: modal view on product click showing images, variants, price and CTA.
6. Contact: contact page with EmailJS wiring via config.json (keys kept out of repo).
7. CI: workflow builds, runs LHCI rules, deploys out/ to gh-pages using GH_PAGES_PAT secret.
8. Image pipeline: script to replace placeholder SVGs with generated JPG/WEBP and update data/products.json.
9. Accessibility: ARIA on interactive components and semantic HTML.
10. Theme: keep existing color palette & font sizing in CSS variables; all new UI should use those variables.
11. Tests: basic smoke check in CI (build success + pages exist).
12. Documentation: README with local dev, build, export, deploy steps and prompt file for image generation.

–––––––––––––––––––––––––
5) Checklist (reusable)
(Use this anytime to verify repository/site health)
–––––––––––––––––––––––––
Pre-deploy checklist
- [ ] package.json and package-lock.json present and in sync (npm ci runs clean).
- [ ] next.config.js uses CommonJS and output: "export".
- [ ] No getStaticProps using `revalidate` or any API requiring a Node runtime.
- [ ] data/products.json contains correct image paths under /images/.
- [ ] public/images/ contains either placeholders or final hero images (product-001.jpg …).
- [ ] .github/workflows/deploy.yml present and references secrets.GH_PAGES_PAT (or uses GITHUB_TOKEN if allowed).
- [ ] GH_PAGES_PAT secret exists in repo secrets if workflow requires it.
- [ ] LHCI config file present and thresholds are reasonable.
- [ ] Contact page configured but API keys are not committed.
- [ ] .gitignore contains node_modules/, .next/, out/
- [ ] README explains dev/build/export/deploy steps and how to update images.

Post-deploy checklist
- [ ] gh-pages branch exists and contains index.html at repo root.
- [ ] Pages settings point to gh-pages branch / root.
- [ ] Published URL loads and home page returns 200.
- [ ] LHCI reports results (pass or known exceptions).
- [ ] Contact form triggers EmailJS (test with test keys in a private environment).
- [ ] Visual spot check for 5 product pages (images, descriptions, modals).
- [ ] Test search and pagination.

Maintenance checklist
- [ ] Rotate GH_PAGES_PAT as needed; don’t store PAT in code.
- [ ] Regenerate package-lock.json whenever package.json deps change.
- [ ] Periodically run Lighthouse and update thresholds if unrealistic.

–––––––––––––––––––––––––
11) Best Practices & Code Standards
(Strictly follow these principles for all code changes)
–––––––––––––––––––––––––
- **SOLID Principles**:
    - **S**: Single Responsibility. Components should do one thing (e.g., `ProductCard` displays data, `ProductList` manages the grid).
    - **O**: Open/Closed. Extend functionality via props/composition, don't modify core logic unnecessarily.
    - **L**: Liskov Substitution. (Less relevant in React prop types, but ensure predictable prop behavior).
    - **I**: Interface Segregation. Pass only necessary props to components.
    - **D**: Dependency Inversion. Use hooks/context for data fetching/state, don't hardcode data inside presentation components.

- **DRY (Don't Repeat Yourself)**:
    - Extract reusable logic into custom hooks (e.g., `useProductSearch`).
    - Use utility classes/CSS variables for consistent styling.
    - Centralize configuration (e.g., `config.json` for site text).

- **Clean Code & Anti-Patterns**:
    - **No Prop Drilling**: Use Context API if data needs to go 3+ levels deep.
    - **No Magic Numbers**: Use named constants.
    - **Avoid Heavy Libraries**: Prefer native browser APIs or lightweight alternatives.
    - **Validation**: Validate props (PropTypes/TypeScript interfaces) and user inputs.

- **Performance**:
    - **Lazy Loading**: All images below the fold MUST use `loading="lazy"`.
    - **CLS Prevention**: All image containers MUST have explicit aspect ratios or width/height attributes.
    - **Code Splitting**: Dynamic imports for heavy modals/components.

12) Automated Verification Loop
(Run this loop after every significant change)
–––––––––––––––––––––––––
1. **Lint & Format**: Ensure code style is consistent (`npm run lint` if available).
2. **Build Check**: Run `npm run build` to catch compile-time errors.
3. **Export Check**: Run `npm run export` to verify static generation.
4. **Visual Regression**: Serve `out/` locally and verify critical paths (Home -> Search -> Product Modal).
5. **Lighthouse**: Run `lhci autorun` to catch performance regressions.

–––––––––––––––––––––––––
6) Current status — Completed vs Remaining
(Use this to track progress at a glance)
–––––––––––––––––––––––––
Completed (based on conversation and commits you made):
- Next.js app structure created, pages and components scaffolded.
- data/products.json with 40 product entries added.
- public/images/ SVG placeholders added for all products.
- scripts/update-images.js implemented.
- .github/workflows/deploy.yml present (PAT-based deploy step added).
- LHCI configuration (.lighthouseci.yml) included.
- Contact page scaffolded & wired to EmailJS placeholders.
- package-lock.json generated locally and committed (you created it).
- next.config.js converted to CommonJS and output: "export".
- ISR references removed from pages (index.js updated).
- Local dev build runs and initial build succeeded (after fixes).

Remaining / ToDo:
- Ensure package-lock.json fully synced with package.json in CI (run npm install locally and push changes if more mismatches remain).
- Fix/observe GitHub Actions failing steps (npm ci lock mismatch resolved locally; re-run Actions).
- Confirm GH_PAGES_PAT is present in repo secrets and deploy step successfully pushes to gh-pages.
- Verify gh-pages branch contains exported out/ files and Pages is configured (Settings → Pages).
- Replace placeholder SVGs with final generated JPG/WEBP images (use update-images.js).
- (Optional) Optimize images to WebP/AVIF and create blurred placeholders for LCP improvements.
- (Optional) Add image CDN/hosted storage integration (Cloudinary/S3).
- Tune LHCI thresholds and address any performance/accessibility issues reported.
- Add small UI polish: product variants, add-to-cart mockup, quick zoom on image.
- Add unit or e2e tests (Playwright/basic smoke).

–––––––––––––––––––––––––
7) Theme & style preservation (how to keep them unchanged)
(Instructions and example variables — do not change values unless intentionally)
–––––––––––––––––––––––––
Principle: centralize all theme tokens in styles/globals.css (or styles/theme.css). Do not hardcode color values across components. Keep tokens names & values the same as current repo.

Example (place these in top of styles/globals.css if not present; otherwise keep the existing file as-is):
:root {
  --color-primary: #7A4B2A; /* brand wood brown — preserve existing value in your repo */
  --color-accent: #A6A36D;  /* warm olive accent */
  --color-bg: #F7F5F2;      /* site background / paper */
  --text-color: #222222;
  --muted: #6B6B6B;

  --font-base: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --container-max-width: 1200px;
}

How to enforce preservation:
- When editing components, reference var(--color-primary) etc.
- Do not change the hex values in :root unless you're intentionally theming.
- Add comments next to variables describing "role" (primary CTA, background, text).
- If you need a different brand palette for experiments, create a separate variables file (e.g., styles/experimental-theme.css) and do not overwrite the canonical one.

Accessibility roles:
- Primary CTA: background var(--color-primary), color: #fff, font-size: var(--font-size-md)
- Secondary CTA / links: color var(--color-accent)
- Body text: color var(--text-color), font-size: var(--font-size-md)
- Muted text: color var(--muted), font-size: var(--font-size-sm)

If you want me to extract exact current color codes & font sizes from your repo files, paste styles/globals.css content here and I’ll produce the canonical token block to lock in.

–––––––––––––––––––––––––
8) Next implementation prompts (detailed, copy-paste friendly)
(Use these in IntelliJ Copilot Chat, GitHub Copilot Chat, ChatGPT, Anthropic, etc.)
–––––––––––––––––––––––––

A. Prompt: “Fix CI package-lock mismatch and re-run workflow”
Paste into LLM/Copilot:
You are an expert CI engineer. My repo Test on GitHub uses a workflow that runs `npm ci`, but CI failed because package-lock.json and package.json were not synchronized. I have local Node available.

Tasks:
1. Run locally:
   - npm install
   - git add package-lock.json package.json
   - git commit -m "chore: sync lockfile with package.json"
   - git push origin main
2. Confirm in this repository the lockfile version matches the dependencies (especially Next.js).
3. After push, check Actions and report if build/export and deploy steps now succeed.

Expected output:
- package-lock.json updated
- A pushed commit on main
- CI run completes build-and-lhci successfully (npm ci passes) and deploy pushes to gh-pages.

B. Prompt: “Confirm and fix GitHub Actions deploy step (permissions & secrets)”
Paste into LLM/Copilot:
I need you to verify the Actions deploy job that uses peaceiris/actions-gh-pages. Ensure the workflow uses the repository secret GH_PAGES_PAT and that GH_PAGES_PAT exists and has repo permissions. If the workflow uses GITHUB_TOKEN and fails due to policies, change to accept GH_PAGES_PAT. Provide a final commit patch for .github/workflows/deploy.yml and instructions to add the secret.

Expected changes:
- peaceiris/actions-gh-pages uses github_token: ${{ secrets.GH_PAGES_PAT }}
- docs (README) updated with steps to create a PAT and add GH_PAGES_PAT.

C. Prompt: “Replace placeholder SVGs with generated images and update products.json”
Paste into Copilot:
I will upload AI-generated images to public/images/ named product-001.jpg product-002.jpg etc. Update data/products.json image arrays to include any matching JPG/WEBP/WebP images found for each product. Use scripts/update-images.js (I have it in scripts/). Tasks:
1. Run scripts/update-images.js locally to detect replacements and update data/products.json.
2. Commit changes: git add public/images data/products.json && git commit -m "chore: add product images and update product paths" && git push origin main
3. Optionally run npm run export and preview out/.

D. Prompt: “Tune LHCI thresholds and mark exceptions”
Paste into Copilot:
Review .lighthouseci.yml and set conservative thresholds so the GH Actions run will pass during initial deploy:
- performance: 50
- accessibility: 80
- best-practices: 80
- seo: 80
Add comments in .lighthouseci.yml explaining how to raise thresholds after optimization.

E. Prompt: “Add a CI step to run scripts/update-images.js when images are added”
Paste into Copilot:
Add to the build job a step that checks for new images in public/images/ and, if present, runs node scripts/update-images.js to update data/products.json before export. Use node 18. Only run this step when public/images/ contains files not referenced in data/products.json to avoid unnecessary changes.

Implementation hint:
- Use git ls-files or a simple Node script to detect unreferenced images.

F. Prompt: “Produce a PR-ready description & tasks for final UX polish”
Paste into Copilot:
Provide a PR description for UX polishing: add hover states on product cards, keyboard accessibility of modal, image gallery with thumbnails, lazy-load images, blurred placeholder (LQIP). Include the tasks and acceptance criteria for each.

–––––––––––––––––––––––––
9) Example one-liner commands for quick actions
- Rebuild & export locally then force deploy to gh-pages:
  npm run build && npm run export && \
  git checkout --orphan gh-pages-temp && \
  git --work-tree=out add --all && \
  git --work-tree=out commit -m "deploy: static site" && \
  git push -f origin HEAD:gh-pages && \
  git checkout main && git branch -D gh-pages-temp

- Sync lockfile:
  npm install && git add package-lock.json package.json && git commit -m "chore: sync lockfile" && git push origin main

–––––––––––––––––––––––––
10) If you want, next I can:
- Produce a single LLM-ready JSON manifest that enumerates all 40 products and per-product image prompts for batch generation.
- Produce the exact .github/workflows/deploy.yml patch to add the update-images step.
- Extract the exact theme colors & font sizes from your styles/globals.css if you paste its content here.

Which of those shall I produce now?

–––––––––––––––––––––––––
11) Best Practices & Code Standards
(Strictly follow these principles for all code changes)
–––––––––––––––––––––––––
- **SOLID Principles**:
    - **S**: Single Responsibility. Components should do one thing (e.g., `ProductCard` displays data, `ProductList` manages the grid).
    - **O**: Open/Closed. Extend functionality via props/composition, don't modify core logic unnecessarily.
    - **L**: Liskov Substitution. (Less relevant in React prop types, but ensure predictable prop behavior).
    - **I**: Interface Segregation. Pass only necessary props to components.
    - **D**: Dependency Inversion. Use hooks/context for data fetching/state, don't hardcode data inside presentation components.

- **DRY (Don't Repeat Yourself)**:
    - Extract reusable logic into custom hooks (e.g., `useProductSearch`).
    - Use utility classes/CSS variables for consistent styling.
    - Centralize configuration (e.g., `config.json` for site text).

- **Clean Code & Anti-Patterns**:
    - **No Prop Drilling**: Use Context API if data needs to go 3+ levels deep.
    - **No Magic Numbers**: Use named constants.
    - **Avoid Heavy Libraries**: Prefer native browser APIs or lightweight alternatives.
    - **Validation**: Validate props (PropTypes/TypeScript interfaces) and user inputs.

- **Performance**:
    - **Lazy Loading**: All images below the fold MUST use `loading="lazy"`.
    - **CLS Prevention**: All image containers MUST have explicit aspect ratios or width/height attributes.
    - **Code Splitting**: Dynamic imports for heavy modals/components.

12) Automated Verification Loop
(Run this loop after every significant change)
–––––––––––––––––––––––––
1. **Lint & Format**: Ensure code style is consistent (`npm run lint` if available).
2. **Build Check**: Run `npm run build` to catch compile-time errors.
3. **Export Check**: Run `npm run export` to verify static generation.
4. **Visual Regression**: Serve `out/` locally and verify critical paths (Home -> Search -> Product Modal).
5. **Lighthouse**: Run `lhci autorun` to catch performance regressions.