# 命运塔罗

一个使用 React + Vite + TypeScript + Tailwind CSS 开发的在线塔罗牌抽卡网页。

## 本地运行

```bash
npm install
npm run dev
```

## 打包

```bash
npm run build
```

## 预览打包结果

```bash
npm run preview
```

## 部署

- Netlify：导入仓库，Build command 填 `npm run build`，Publish directory 填 `dist`。
- Vercel：导入仓库，Framework 选择 Vite，Build command 使用 `npm run build`，Output directory 使用 `dist`。
- GitHub Pages：先设置好仓库地址，然后运行 `npm run deploy:gh-pages`。

## 替换真实塔罗牌图片

项目已经在 `public/cards` 中提供 78 张 SVG 占位牌面。替换真实图片时，把图片放到 `public/cards` 目录，例如 `public/cards/the-fool.jpg`，再修改 `src/data/tarotDeck.ts` 中对应牌的 `imagePath` 字段为 `./cards/the-fool.jpg`。
