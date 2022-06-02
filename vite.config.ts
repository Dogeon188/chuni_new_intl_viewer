import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocessor from "svelte-preprocess";
import path from "path"

export default defineConfig({
    // mode: "development",
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
            // compilerOptions: {dev: true},
            preprocess: [
                sveltePreprocessor({
                    sourceMap: false,
                }),
            ],
            extensions: [".svelte"],
            emitCss: false,
        })
    ],
})