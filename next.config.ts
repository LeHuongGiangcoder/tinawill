import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ảnh khách là file tĩnh trong public/, không qua loader ngoài.
  images: {
    // Trần 828px: trên iPhone 3x, 1200px+ giải nén ra ~10MB mỗi ảnh nền và
    // Safari đóng tab khi tổng bộ nhớ ảnh vượt ngưỡng.
    deviceSizes: [640, 750, 828],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
