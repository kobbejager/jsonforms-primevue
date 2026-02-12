import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwind from "@tailwindcss/vite"

// Dedicated build config for the demo app.
export default defineConfig({
    base: "./",
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
