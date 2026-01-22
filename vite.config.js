import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import tailwind from "@tailwindcss/vite"


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        tailwind(),
    ],
    build: {
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
