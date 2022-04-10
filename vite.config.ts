import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocessor from "svelte-preprocess";

export default defineConfig({
    // mode: "development",
    build: {
        outDir: "./",
        lib: {
            entry: "./src/main.ts",
            formats: ["iife"],
            fileName: () => "main.min.js",
            name: "chuni_intl_viewer",
        },
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
});