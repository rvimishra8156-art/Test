/** Next.js static export configuration */
const nextConfig = {
  reactStrictMode: true,
  // Configure next export compatibility
  output: "export",
  // For next export, avoid using next/image optimization that requires Node server.
  // Serve images from public/ folder (we use standard <img> tags).
};

export default nextConfig;