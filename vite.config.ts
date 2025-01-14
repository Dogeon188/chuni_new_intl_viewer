import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import sveltePreprocessor from "svelte-preprocess"
import path from "path"

export default defineConfig({
    // mode: "development",
    define: {
        "__APP_VERSION__": process.env.npm_package_version
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: "./",
        lib: {
            entry: "./src/main.ts",
            formats: ["iife"],
            fileName: () => "main.min.js",
            name: "chuni_intl_viewer",
        }
    },
    plugins: [
        svelte({
            // compilerOptions: { dev: true },
            preprocess: [
                sveltePreprocessor({
                    sourceMap: false,
                }),
            ],
            extensions: [".svelte"],
            emitCss: false,
            onwarn(warning, handler) {
                if (warning.code == "a11y-click-events-have-key-events") return
                if (handler) handler(warning)
            },
        })
    ],
})