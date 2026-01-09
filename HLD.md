# High Level Design (HLD)

Overview
- Frontend: React (Vite recommended) single-page app hosted on Vercel/Netlify
- Backend: Optional; for MVP will use EmailJS for contact form and WhatsApp integration for sales contact. For production, a small backend (Node/Express or serverless) is recommended for inventory, orders, authentication, payments.
- CDN: Images served via CDN (Cloudinary / Imgix / S3 + CloudFront) with automatic webp conversion and responsive sizes.
- Analytics: Google Analytics / GA4 + Hotjar for session recording/A-B tests.

Components (high-level)
- Header (email on top, nav)
- ProductList (search, filters, pagination)
- ProductCard (thumbnail, name, price range, WhatsApp button)
- ProductModal (carousel, large view, details, WhatsApp + Enquire)
- Footer (about, contact, social)
- ContactPage (form wired to EmailJS)
- Config (config.json)

Data flow (frontend)
- Static products sourced from `src/data/products.js` (MVP)
- Search uses client-side filtering (debounced)
- Pagination uses client-side slicing
- Product modal reads product object and shows images array and details

Non-functional requirements (NFR)
- Performance: First Contentful Paint < 1.5s (mobile on 4G), Lighthouse perf >= 60
- Accessibility: WCAG AA basics, alt tags for images, keyboard-friendly modals
- Security: Use CSP headers on hosting, sanitize inputs in serverless endpoints
- Scalability: Images & static assets delivered via CDN; frontend served as static site
- Maintainability: Single source config, modular components
- Internationalization: Text strings kept few and easily extracted

Security considerations
- Do not store API keys in client-side code. Use env vars or serverless proxies where needed.
- For EmailJS, use public key pattern they provide safely, or proxy through serverless backend for full privacy.

Monitoring
- Sentry for errors (frontend)
- Analytics for conversion funnels
- Automated Lighthouse checks in CI
