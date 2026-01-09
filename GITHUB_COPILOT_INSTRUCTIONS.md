```markdown
# GitHub Copilot / Contributor Guidance for this repo

Purpose
- This file tells contributors (and Copilot-assisted workflows) how to extend and maintain this repo quickly and consistently.

Key rules for Copilot suggestions
1. Always consult `config.json` for company values (email, phone, brand color).
2. Keep UI components small and single-responsibility.
3. When generating new component code:
   - Use function components and hooks.
   - Avoid inline CSS; append styles to `src/styles.css` and use CSS variables.
   - Ensure translations-ready strings (place user-facing text in `i18n` object if added).
4. For images: prefer WebP, serve responsive sizes (srcset). Use external assets stored in `assets/` or a CDN.
5. For modals and keyboard interactions: ensure Escape closes modal, focus trap is used.
6. For any network requests off client, prefer serverless functions (Netlify Functions / Vercel Serverless) with API keys stored in GitHub Actions secrets.
7. When adding tests: use React Testing Library and write one render + interaction test per component.

Commit messages
- Use conventional commits: feat(scope): description, fix(scope): description, chore: ...
- Include issue number if applicable.

PR review checklist
- Performance: Lighthouse score baseline (desktop >= 90, mobile >= 60)
- Accessibility: No critical a11y violations
- Code quality: No duplicated logic, follows DRY
- Config driven: No hard-coded company info (use config.json)
