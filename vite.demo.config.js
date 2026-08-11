import { fileURLToPath, URL } from "node:url"
import { readFileSync } from "node:fs"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwind from "@tailwindcss/vite"

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"))

// Dedicated build config for the demo app.
export default defineConfig({
    base: "./",
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    plugins: [
        vue(),
        tailwind(),
    ],
    build: {
        outDir: "dist-demo",
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
