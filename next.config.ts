import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/",
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // next-pwa injects a webpack config; production builds use `next build --webpack`.
  turbopack: {},
};

export default withPWA(nextConfig);
