cat > next.config.js <<'EOF'
/** Next.js static export configuration (CommonJS) */
const nextConfig = {
  reactStrictMode: true,
  // Ensure static export compatibility
  output: "export"
  // Note: next/image optimization that requires a Node server is avoided for static export.
};

module.exports = nextConfig;
EOF