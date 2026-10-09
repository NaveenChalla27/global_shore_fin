import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // Dev: forward /api to the edge-service so relative API calls work.
        proxy: {"/api": "http://localhost:4000"},
    },
    build: {
        outDir: "dist",
        sourcemap: false,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("react-router")) return "router";
                        if (id.includes("react-dom") || id.includes("react/")) return "react";
                    }
                },
            },
        },
    },
});
