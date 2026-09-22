import type { NextConfig } from "next";

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseUrl
      ? [new URL("/storage/v1/object/public/menu-images/**", supabaseUrl)]
      : [],
  },
  experimental: {
    // Ürün fotoğrafları (en fazla 5 MB) Server Action ile yüklenir.
    serverActions: { bodySizeLimit: "6mb" },
  },
};

export default nextConfig;
