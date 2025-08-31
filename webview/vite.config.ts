import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        // Optimize chunk splitting
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'jwt-decode']
        }
      }
    },
    // Bundle size optimizations
    minify: 'esbuild',
    target: 'es2020',
    cssCodeSplit: true,
    // Ensure assets are properly included
    copyPublicDir: true
  },
  // Make sure assets are handled properly
  publicDir: 'public',
  server: {
    port: 3000,
    strictPort: true
  }
})