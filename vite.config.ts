import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // 禁用 Rolldown，使用传统 Rollup 以避免 type export 兼容性问题
  build: {
    useRolldown: false,
  },
})
