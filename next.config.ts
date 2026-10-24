import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ảnh khách là file tĩnh trong public/, không qua loader ngoài.
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
