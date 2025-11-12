import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default defineConfig({
    base: "/E-cards-website/",
    plugins: [
        vue(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
            symbolId: "icon-[dir]-[name]",
            inject: "body-last",
            customDomId: "__svg__icons__dom__",
        }),
    ],
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./node_modules"),
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
