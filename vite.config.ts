import { defineConfig } from "vite"
import { cloudflare } from "@cloudflare/vite-plugin"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // The wave library carries a local patch (patches/). Left out of Vite's
  // pre-bundling it is served straight from node_modules, so a change to the
  // patch shows on the next reload. Pre-bundled, the dev server kept serving
  // the copy it made at startup until it was restarted with --force.
  optimizeDeps: { exclude: ["distortion-wave"] },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})
