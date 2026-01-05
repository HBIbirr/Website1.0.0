import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 关键修复 1：允许使用最新的浏览器特性，解决 Google GenAI 库报错
    target: 'esnext',
    // 关键修复 2：如果还报错，尝试调大块大小警告
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  // 关键修复 3：强制预构建这些依赖
  optimizeDeps: {
    include: ['@google/genai']
  }
})