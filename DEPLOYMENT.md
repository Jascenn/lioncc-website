# LionCC Website 部署文档

## 仓库架构

### 双仓库工作流
本项目使用双仓库协作模式：

1. **个人开发仓库**: `Jascenn/lioncc-website`
   - 用于日常开发和测试
   - 拥有完整的推送权限
   - 作为开发环境

2. **生产仓库**: `LionCCAPI/lioncc-website`
   - 生产环境，对外提供服务
   - 通过 Pull Request 更新
   - 域名：https://lioncc.ai

## 工作流程

### 标准开发流程

```
本地修改 → Jascen/lioncc-website → Pull Request → LionCCAPI/lioncc-website → 自动部署
```

### 详细步骤

#### 1. 本地开发
```bash
# 在开发分支进行修改
git checkout -b dev/feature-name

# 开发和测试
# ... 进行代码修改 ...

# 提交更改
git add .
git commit -m "feat: 添加新功能"
```

#### 2. 推送到个人仓库
```bash
# 推送开发分支
git push origin dev/feature-name

# 合并到个人仓库的 main 分支
git checkout main
git merge dev/feature-name
git push origin main
```

#### 3. 同步到生产仓库
```bash
# 方式1: 通过 PR（推荐）
# 访问 https://github.com/Jascenn/lioncc-website
# 点击 "Contribute" → "Open pull request"
# 选择 LionCCAPI/lioncc-website:main ← Jascenn/lioncc-website:main

# 方式2: 直接推送（需要权限）
git push lioncc main
```

## 远程仓库配置

### 查看远程仓库
```bash
git remote -v
```

输出：
```
lioncc  git@github.com:LionCCAPI/lioncc-website.git (fetch)
lioncc  git@github.com:LionCCAPI/lioncc-website.git (push)
origin  ssh://git@github.com/Jascenn/lioncc-website.git (fetch)
origin  ssh://git@github.com/Jascenn/lioncc-website.git (push)
```

### 添加生产仓库（如需要）
```bash
git remote add lioncc git@github.com:LionCCAPI/lioncc-website.git
```

## 自动部署机制

### GitHub Actions 工作流
- 位置：`.github/workflows/deploy.yml`
- 触发条件：推送到 `main` 分支
- 部署目标：`gh-pages` 分支

### 部署流程
```
Push to main → GitHub Actions 触发 → 构建 → 部署到 gh-pages → GitHub Pages 更新
```

## 域名配置

### 自定义域名：lioncc.ai

#### DNS 配置
域名 DNS 已配置指向 GitHub Pages：
- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

#### CNAME 文件
- 位置：项目根目录的 `CNAME` 文件
- 内容：`lioncc.ai`
- 重要：每次部署都必须包含此文件

### 验证域名配置
```bash
# 检查 DNS 解析
nslookup lioncc.ai

# 检查 CNAME 文件
cat CNAME
```

## 分支说明

### main 分支
- 生产代码分支
- 所有功能合并到此分支
- 推送到此分支会触发自动部署

### gh-pages 分支
- GitHub Pages 部署分支
- 由 GitHub Actions 自动管理
- 不应手动修改

### dev/* 分支
- 功能开发分支
- 命名规范：`dev/feature-name`
- 开发完成后合并到 main

## 本地预览

### 启动本地服务器
```bash
# 在项目目录下
python3 -m http.server 8000

# 访问
# http://localhost:8000
```

### 停止服务器
按 `Ctrl + C` 或关闭终端

## 常见问题

### 1. 网站更新后没有立即生效
**原因**：浏览器缓存或 CDN 缓存
**解决**：
- 强制刷新：Mac `Cmd + Shift + R`，Windows `Ctrl + F5`
- 清除浏览器缓存
- 等待 5-10 分钟让 CDN 更新

### 2. lioncc.ai 无法访问
**检查清单**：
1. CNAME 文件是否存在于 gh-pages 分支
2. GitHub Pages 设置是否正确
3. DNS 解析是否正常：`nslookup lioncc.ai`
4. GitHub Actions 是否部署成功

### 3. 推送到 LionCCAPI 失败（permission denied）
**原因**：没有直接推送权限
**解决**：通过 Pull Request 方式更新

### 4. gh-pages 分支没有更新
**检查**：
1. GitHub Actions 是否运行成功
2. 访问：https://github.com/LionCCAPI/lioncc-website/actions
3. 查看工作流运行日志

## 项目结构

```
lioncc-website/
├── .github/workflows/deploy.yml        # 自动部署到 gh-pages
├── .githooks/pre-commit                # 自动 build hook（需 git config 启用）
├── src/tailwind-input.css              # Tailwind 入口
├── tailwind.config.js                  # Tailwind 扫描配置
├── package.json + bun.lock             # Bun 依赖
│
├── index.html                          # 首页（Tailwind 系）
├── 404.html                            # 404 页（独立无依赖）
├── sitemap.xml + robots.txt            # SEO 三件套
├── og-image.jpg                        # 社交分享预览图（1200×630）
├── CNAME                               # 自定义域名
│
├── pages/
│   ├── terms.html / privacy.html       # 法务页（Tailwind 系）
│   └── *-guide.html                    # 教程页（Tutorial 系，独立 CSS）
│
├── css/
│   ├── tailwind.css                    # ⚠️ build 产物，pre-commit hook 自动维护
│   ├── styles.css                      # 自定义全局样式
│   └── tutorial-guide.css              # 教程页专用 CSS（手写，不依赖 Tailwind）
│
├── js/
│   ├── main.js / subscription-modal.js # 首页交互（Tailwind 系扫描）
│   └── tutorial-guide.js               # 教程页交互
│
├── images/  + videos/                  # 静态资源
└── README.md / DEPLOYMENT.md
```

---

## 架构总览：两套独立子系统

仓库实际上分两套互不影响的页面族群，理解这点能避免改错文件：

| 子系统 | 页面 | CSS | JS | 是否需要 Tailwind build |
|---|---|---|---|---|
| **Tailwind 系** | `index.html` / `pages/terms.html` / `pages/privacy.html` | `tailwind.css` + `styles.css` | `main.js` + `subscription-modal.js` | **是** |
| **Tutorial 系** | `pages/*-guide.html`（claude / chatgpt-plus / gptplus-free） | `tutorial-guide.css`（手写）| `tutorial-guide.js` | **否** |

> 加新教程页：复制现有 `*-guide.html` 模板即可，不需要 build。
> 改首页 / 法务页 / 订阅弹窗：触发 build（pre-commit hook 自动处理）。

---

## Tailwind 构建系统

### 为什么要 build

Tailwind 不是预生成所有 CSS，而是**按需生成**——扫描 HTML/JS 里实际用到的 class，只输出这些规则。
- 之前用 `cdn.tailwindcss.com`：用户浏览器**每次访问**都要下载 407 KB 脚本并实时扫描 DOM 生成 CSS
- 现在用本地 build：你这台电脑**一次性**扫描生成 23 KB CSS，所有用户直接用

### 何时需要 build

| 改了什么 | 需要 build？ |
|---|---|
| `index.html` / `pages/terms.html` / `pages/privacy.html` 新增 Tailwind class | ✅ |
| `js/main.js` / `js/subscription-modal.js` 新增 Tailwind class | ✅ |
| 改 HTML 文字内容（不动 class）| ❌ |
| 改 `pages/*-guide.html`（Tutorial 系）| ❌ |
| 改 `css/styles.css` / `css/tutorial-guide.css` | ❌ |

### 如何 build（三种方式）

```bash
# 1. 自动（推荐）—— pre-commit hook 检测到触发文件后自动执行
git commit -m "..."   # hook 自动跑 build 并 stage css/tailwind.css

# 2. 手动一次性
bun run build         # 等价于：bunx tailwindcss -i src/tailwind-input.css -o css/tailwind.css --minify

# 3. 监听模式（本地反复调试时）
bun run dev           # 文件改变时自动重 build
```

### pre-commit hook

位置：`.githooks/pre-commit`（git tracked，所有人共享）。
逻辑：`git commit` 时检查暂存区，若改了 Tailwind 触发文件（`index.html` / `terms/privacy.html` / `main.js` / `subscription-modal.js` / `src/tailwind-input.css` / `tailwind.config.js`），自动 `bun run build` 并把 `css/tailwind.css` 加入本次 commit。

### 首次 clone 后必做

```bash
bun install                           # 装依赖
git config core.hooksPath .githooks   # 启用自动 build hook
```

---

## SEO 资源

| 文件 | 作用 |
|---|---|
| `sitemap.xml` | 列出 6 个 URL 给搜索引擎抓取 |
| `robots.txt` | 允许全部抓取 + 声明 sitemap |
| `404.html` | 自定义 404 页（GitHub Pages 自动接管，无外部依赖）|
| `og-image.jpg` | 1200×630 社交分享卡片图（微信/Twitter 等链接预览）|

后续维护：
- 加新页面 → 在 `sitemap.xml` 里追加一条 `<url>`
- 换 OG 图 → 直接替换 `og-image.jpg`，保持 1200×630

---

## 回滚操作

线上出问题时按以下步骤操作。**永远不要 force push 到 main**。

### 方式 1：回滚到上一个稳定版本（推荐）

```bash
# 1. 找到要撤销的 merge commit hash
git log --oneline --merges -5

# 2. 用 revert 安全撤销（保留历史）
git revert -m 1 <merge-commit-hash>
git push
```

GitHub Actions 1-2 分钟后自动重新部署到上一个状态。

### 方式 2：回滚单个文件

```bash
# 把某个文件恢复到指定 commit 的版本
git checkout <commit-hash> -- pages/some-file.html
git commit -m "fix: rollback some-file.html to <hash>"
git push
```

### 关键里程碑（保险用）

| 时间 | Commit | 描述 |
|---|---|---|
| 2026-04-26 | `497a108` | SEO baseline + cleanup 完成 |
| 2026-04-26 | `22a7a53` | Tailwind CDN 切换为本地 build |

---

## 最近更新

### 2026-04-26
- ✅ Claude 订阅充值教程页上线（含视频段，3 分 38 秒演示）
- ✅ 教程页对齐 ChatGPT Plus 模板（飞书图文文档入口、summary 按钮等）
- ✅ SEO 三件套：sitemap.xml / robots.txt / 404.html / og-image.jpg
- ✅ 删除无效 hreflang `/en` 和 `og:locale:alternate=en_US`
- ✅ 压缩 step-05a.jpg（626KB → 440KB）
- ✅ Claude 教程页 inline style 抽到 CSS（`.step-card--scheme-a/b`）
- ✅ Tailwind CDN 切换为本地 build（407KB → 23KB，-94%）
- ✅ 修复 terms/privacy 的 `css/styles.css` 路径 bug（应为 `../css/styles.css`）
- ✅ 引入 Bun + pre-commit hook 自动构建链

### 2024-12-04
- ✅ 添加 AI 批量生图工具产品卡片
- ✅ 添加产品链接：https://1024hub.xyz/
- ✅ 更新 Footer 产品列表
- ✅ 更新 main.js 产品标签映射
- ✅ 添加 CNAME 文件支持自定义域名

## 联系方式

如有问题，请联系：
- 仓库维护者：Jascenn
- 生产环境：LionCCAPI 组织

---

📝 文档更新日期：2026-04-26
