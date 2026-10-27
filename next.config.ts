import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "",
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
};

export default nextConfig;
