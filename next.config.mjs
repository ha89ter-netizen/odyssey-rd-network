/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  webpack: (config, { dev }) => {
    if (dev) {
      // Screenshot tooling writes into the project root; without this the
      // dev watcher re-compiles in a loop.
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules/**", "**/.git/**", "**/.next/**", "**/.playwright-mcp/**"],
      };
    }
    return config;
  },
};
export default nextConfig;
