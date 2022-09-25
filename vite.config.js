import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: "customRangeController",
      fileName: `custom-range-controller`,
    }
  },
  rollupOptions: {
    external: ["vue"],
    output: {
      globals: {
        vue: "vue",
      },
    },
  },
  plugins: [vue()]
})
