import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
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
                "vue",
                "primevue",
                "primeicons",
                "@primevue/themes",
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
