import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // 네이버 api를 위한 프록시 서버
  server: {
    proxy: {
      "/v1": {
        target: "https://openapi.naver.com",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
});
