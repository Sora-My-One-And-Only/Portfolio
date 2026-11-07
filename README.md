# KUROGANE · OFFICIAL GAME DESIGN WORKS (`<username>.github.io`)

**林 海斗 (Kaito Lin) — 游戏策划（战斗策划 / 关卡策划）个人作品设定资料集**  
*Official Game Design Works / Editorial Artbook Portfolio for GitHub Pages (`.github.io`)*

---

## 一、如何上传并发布到你的 GitHub Pages (`<username>.github.io`)

本项目已内置完整的 **GitHub Pages 静态构建配置 (`vite.config.ts`)**、**SPA 路由回退 (`public/404.html` & `public/.nojekyll`)**、**预生成的日式 RPG 静态原声音乐 (`public/audio/jrpg-sanctuary-bgm.mp3`)** 以及 **GitHub Actions 自动部署流水线 (`.github/workflows/deploy.yml`)**。

### 方法 A：使用 AI Studio 顶部工具栏直接同步到 GitHub（推荐）
1. 点击当前 AI Studio 界面右上角的 **GitHub 图标（Export / Sync to GitHub）**。
2. 授权你的 GitHub 账号后，将新建仓库名称填写为：
   - **`<你的GitHub用户名>.github.io`**（例如 `kurogane-dev.github.io`，可直接作为个人根域名访问）
3. 同步完成后，打开你的 GitHub 仓库页面：
   - 进入 **Settings** $\rightarrow$ **Pages**
   - 在 **Build and deployment** $\rightarrow$ **Source** 下拉菜单中选择 **`GitHub Actions`**
4. 仓库中的 `.github/workflows/deploy.yml` 会自动执行 `npm run build` 并将 `./dist` 静态产物发布至 `https://<你的GitHub用户名>.github.io`！

### 方法 B：下载源码并通过 Git 命令行推送
```bash
# 1. 初始化并提交代码（已预置 main 分支）
git init -b main
git add -A
git commit -m "feat: publish Official Game Design Works portfolio (.github.io)"

# 2. 关联你的 GitHub Pages 仓库并推送
git remote add origin https://github.com/<你的GitHub用户名>/<你的GitHub用户名>.github.io.git
git push -u origin main
```

---

## 二、本地开发与静态构建验证

```bash
# 安装依赖
npm install

# 启动本地开发预览 (Port 3000)
npm run dev

# 生成 GitHub Pages 纯静态构建产物 (输出至 ./dist)
npm run build
```
