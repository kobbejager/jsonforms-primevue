import { fileURLToPath, URL } from "node:url"
import { readFileSync } from "node:fs"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwind from "@tailwindcss/vite"

const pkg = JSON.parse(readFileSync(new URL("./package.json", import.meta.url), "utf-8"))

// https://vitejs.dev/config/
export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    },
    plugins: [
        vue(),
        tailwind(),
    ],
    build: {
        copyPublicDir: false,
        lib: {
            entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
            name: "JsonformsPrimeVue",
            fileName: "index",
            formats: ["es", "cjs"],
        },

        rollupOptions: {
            external: [
                // Keep Vue external
                "vue",
                // Externalize PrimeVue and its subpath imports like primevue/inputtext
                /^(?:primevue)(?:\/.*)?$/,
                // Icons
                "primeicons",
                // JSONForms
                "@jsonforms/core",
                "@jsonforms/vue",
            ],
            output: {
                globals: {
                    vue: "Vue",
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
})
