import { networkInterfaces } from "node:os";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: Object.values(networkInterfaces()).flatMap((interfaces) =>
    (interfaces ?? [])
      .filter(({ family, internal }) => family === "IPv4" && !internal)
      .map(({ address }) => address),
  ),
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
