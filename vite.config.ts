import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // 使用相对资源路径，方便部署到 Netlify、Vercel 或 GitHub Pages 的子路径。
  base: './',
});
