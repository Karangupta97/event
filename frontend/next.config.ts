import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the Turbopack root to this app so the extra lockfile at the
  // repository root doesn't trigger a workspace-root inference warning.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
