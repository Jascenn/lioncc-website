# LionCC Website 部署文档

## 部署架构（实际生效）

```
本地修改
   ↓ git push
github.com/Jascenn/lioncc-website  (main 分支)
   ↓ .github/workflows/deploy.yml 触发
   ↓ peaceiris/actions-gh-pages@v3
github.com/Jascenn/lioncc-website  (gh-pages 分支，由 Action 自动维护)
   ↓ GitHub Pages 静态服务
GitHub Pages 全球 CDN  (server: GitHub.com, IP 185.199.108-111.x)
   ↓ DNS A 记录
lioncc.ai  /  www.lioncc.ai
```

### 关键节点

| 角色 | 实体 |
|---|---|
| 域名 | `lioncc.ai`（CNAME 文件控制） |
| 静态托管 | GitHub Pages |
| HTTPS 证书 | Let's Encrypt（GitHub Pages 自动签发与续期） |
| 源仓库 | `github.com/Jascenn/lioncc-website` |
| 开发分支 | `main`（push 即触发部署） |
| 部署分支 | `gh-pages`（由 GitHub Actions 自动覆写，**不要手动改**） |
| CI/CD | `.github/workflows/deploy.yml`（一次构建 10–15 秒） |
| 全局 CDN 缓存 | GitHub Pages 自带，`cache-control: max-age=600` |

### 历史包袱（不在生产路径上，可忽略）

- **`github.com/LionCCAPI/lioncc-website`**：曾计划做"双仓库 PR 工作流"的生产镜像仓，最终未启用。`lioncc.ai` 直接绑在 `Jascenn/lioncc-website` 上，删除该镜像仓**不会影响生产**。
- **Vercel project `jascens-projects/lioncc-website`**：曾从 Vercel 导入此 GitHub 仓做副部署，因缺 `public/` 输出目录持续 build 失败。**已于 2026-04-27 通过 Vercel API 断开 Git 连接**（项目本体保留，可一键重连，回滚步骤见下文）。

---

## 标准开发流程

```bash
# 1. 本地修改（也可走 feature 分支，本仓单人维护时直接 main 即可）
git checkout main
# ... 编辑 ...

# 2. 提交（Tailwind 触发文件 → pre-commit hook 自动 build 并 stage css/tailwind.css）
git add <files>
git commit -m "feat(scope): ..."

# 3. 推送，自动部署
git push origin main

# 4. 等 1–2 分钟，访问 https://lioncc.ai/ 验证
#    ⌘+Shift+R 强刷以跳过浏览器缓存
```

### 验证部署是否成功

```bash
# 看最近一次 Action run 状态
gh run list --workflow=deploy.yml --limit 3

# 看 lioncc.ai 真实 last-modified（应 ≈ Action 完成时间）
curl -sI https://lioncc.ai/ | grep -i last-modified

# 看 lioncc.ai 是否反映了最新 commit 的内容
curl -s https://lioncc.ai/ | grep -E '<某段你刚改的文字>'
```

---

## 架构总览：两套独立子系统

仓库实际上分两套互不影响的页面族群，理解这点能避免改错文件：

| 子系统 | 页面 | CSS | JS | 是否需要 Tailwind build |
|---|---|---|---|---|
| **Tailwind 系** | `index.html` / `pages/terms.html` / `pages/privacy.html` | `tailwind.css` + `styles.css` | `main.js` + `subscription-modal.js` + `i18n.js` | **是** |
| **Tutorial 系** | `pages/*-guide.html`（claude / chatgpt-plus / gptplus-free） | `tutorial-guide.css`（手写） | `tutorial-guide.js` | **否** |

> 加新教程页：复制现有 `*-guide.html` 模板即可，不需要 build。
> 改首页 / 法务页 / 订阅弹窗：触发 build（pre-commit hook 自动处理）。

---

## Tailwind 构建系统

### 为什么要 build

Tailwind 不是预生成所有 CSS，而是**按需生成**——扫描 HTML/JS 里实际用到的 class，只输出这些规则。
- 之前用 `cdn.tailwindcss.com`：用户浏览器**每次访问**都要下载 407 KB 脚本并实时扫描 DOM 生成 CSS
- 现在用本地 build：你这台电脑**一次性**扫描生成 ~24 KB CSS，所有用户直接用

### 何时需要 build

| 改了什么 | 需要 build？ |
|---|---|
| `index.html` / `pages/terms.html` / `pages/privacy.html` 新增 Tailwind class | ✅ |
| `js/main.js` / `js/subscription-modal.js` / `js/i18n.js` 新增 Tailwind class | ✅ |
| 改 HTML 文字内容（不动 class） | ❌ |
| 改 `pages/*-guide.html`（Tutorial 系） | ❌ |
| 改 `css/styles.css` / `css/tutorial-guide.css` | ❌ |
| 改 `js/i18n/*.json`（字典） | ❌ |

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
逻辑：`git commit` 时检查暂存区，若改了 Tailwind 触发文件，自动 `bun run build` 并把 `css/tailwind.css` 加入本次 commit。

### 首次 clone 后必做

```bash
bun install                           # 装依赖
git config core.hooksPath .githooks   # 启用自动 build hook
```

---

## 国际化（i18n）

### 字典与运行时

| 文件 | 作用 |
|---|---|
| `js/i18n.js` | ~110 行轻量运行时：扫 `[data-i18n]` 元素，按当前语言替换 textContent |
| `js/i18n/zh.json` | 中文字典（默认语言） |
| `js/i18n/en.json` | 英文字典 |
| `[data-lang-switcher]` 元素 | 触发语言切换按钮（首页 nav 与 privacy/terms nav 各一个） |

### 语言决策优先级

```
URL 参数 ?lang=zh|en  >  localStorage('lioncc-lang')  >  默认 zh
```
> `navigator.language` 自动探测**未启用**——见 `js/i18n.js` 注释。

### 切换事件

`window.i18n.setLang(lang)` 内部会：
1. 写 localStorage + 同步 URL `?lang=`
2. 加载缺失的字典 JSON
3. 调用 `applyTranslations()` 替换所有 `[data-i18n]`
4. 派发 `i18n:changed` 事件（动态渲染脚本如 `main.js` 的 case studies 监听此事件重渲染）

### 加新翻译 key

1. HTML 元素加 `data-i18n="ns.key"`
2. `js/i18n/zh.json` + `js/i18n/en.json` 同步加该 key（必须双语对齐，否则会 fallback 到 zh）
3. 不需要 build，刷新页面即可生效

---

## SEO 资源

| 文件 | 作用 |
|---|---|
| `sitemap.xml` | 列出所有 URL 给搜索引擎抓取 |
| `robots.txt` | 允许全部抓取 + 声明 sitemap |
| `404.html` | 自定义 404 页（GitHub Pages 自动接管） |
| `og-image.jpg` | 1200×630 社交分享卡片图（微信/Twitter 链接预览） |
| `index.html` head 区 | description / keywords / og:* / twitter:* / JSON-LD：每加新产品都要同步 |

后续维护：
- 加新页面 → 在 `sitemap.xml` 里追加一条 `<url>`
- 换 OG 图 → 直接替换 `og-image.jpg`，保持 1200×630
- 加新产品 → 5 处 SEO meta 同步刷新（description / keywords / og:description / twitter:description / JSON-LD description）

---

## 项目结构

```
lioncc-website/
├── .github/workflows/deploy.yml        # 自动部署到 gh-pages
├── .githooks/pre-commit                # 自动 build hook（需 git config 启用）
├── .gitignore                          # 含 .vercel* / node_modules / 构建产物等
├── src/tailwind-input.css              # Tailwind 入口
├── tailwind.config.js                  # Tailwind 扫描配置
├── package.json + bun.lock             # Bun 依赖
│
├── index.html                          # 首页（Tailwind 系，含 [data-i18n] 标签）
├── 404.html                            # 404 页（独立无依赖）
├── sitemap.xml + robots.txt            # SEO
├── og-image.jpg                        # 社交分享预览图（1200×630）
├── CNAME                               # 自定义域名（lioncc.ai）
│
├── pages/
│   ├── terms.html / privacy.html       # 法务页（Tailwind 系，全文 i18n）
│   └── *-guide.html                    # 教程页（Tutorial 系，独立 CSS，仅 chrome i18n）
│
├── css/
│   ├── tailwind.css                    # ⚠️ build 产物，pre-commit hook 自动维护
│   ├── styles.css                      # 自定义全局样式
│   └── tutorial-guide.css              # 教程页专用 CSS（手写，不依赖 Tailwind）
│
├── js/
│   ├── i18n.js                         # 轻量 i18n 运行时
│   ├── i18n/{zh,en}.json               # 字典
│   ├── main.js                         # 首页交互（产品筛选 / 案例渲染 / 滚动 spy）
│   ├── subscription-modal.js           # 订阅弹窗（点 ChatGPT 卡触发）
│   └── tutorial-guide.js               # 教程页交互
│
├── images/  + videos/                  # 静态资源（视频 30M 暂留 git）
└── README.md / DEPLOYMENT.md
```

---

## 回滚操作

线上出问题时按以下步骤操作。**永远不要 force push 到 main**。

### 方式 1：回滚到上一个稳定版本（推荐）

```bash
# 1. 找到要撤销的 commit hash
git log --oneline -10

# 2. 用 revert 安全撤销（保留历史）
git revert <commit-hash>
# 或撤销一个 merge：
# git revert -m 1 <merge-commit-hash>

git push origin main
```

GitHub Actions 1–2 分钟后自动重新部署到上一个状态。

### 方式 2：回滚单个文件

```bash
git checkout <commit-hash> -- pages/some-file.html
git commit -m "fix: rollback some-file.html to <hash>"
git push
```

### 方式 3：回滚 Vercel 断开（如未来需要恢复 Vercel 副部署）

> 占位符说明：
> - `<YOUR-VERCEL-TEAM-ID>` 在 https://vercel.com/teams/jascens-projects/settings → "Team ID" 复制
> - `<你的-vercel-token>` 在 https://vercel.com/account/tokens 创建后立即用立即撤销

```bash
# 重新连回 GitHub
curl -X POST "https://api.vercel.com/v9/projects/lioncc-website/link?teamId=<YOUR-VERCEL-TEAM-ID>" \
  -H "Authorization: Bearer <你的-vercel-token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"github","repo":"Jascenn/lioncc-website"}'
```

或 Dashboard 路径：https://vercel.com/jascens-projects/lioncc-website → Settings → Git → Connect Repository → 选 `Jascenn/lioncc-website` → Save。

> ⚠️ 重连前先加好 `vercel.json`（`outputDirectory: "."`），否则会再次 build 失败。

### 关键里程碑（保险用）

| 时间 | Commit / 状态 | 描述 |
|---|---|---|
| 2026-04-26 | `497a108` | SEO baseline + cleanup |
| 2026-04-26 | `22a7a53` | Tailwind CDN 切换为本地 build |
| 2026-04-27 | `40a3b86` | 新增 LionKit · 创作工坊产品卡 |
| 2026-04-27 | `6d0b587` | i18n 框架上线（zh/en 切换） |
| 2026-04-27 | `f650a38` | i18n 全覆盖（modal / 子页 / 案例区） |
| 2026-04-27 | `ab10ed8` | 新增 VibeCodingAPI 创意社区产品卡 |
| 2026-04-27 | `cd4a8c8` | SEO meta 同步 GPT Image 2 创意社区 |

---

## 常见问题

### 1. 网站更新后没有立即生效
**原因**：浏览器缓存或 Pages CDN 缓存（max-age=600）。
**解决**：
- 强刷：⌘+Shift+R（Mac）/ Ctrl+F5（Win）
- 等 5–10 分钟让 GitHub Pages CDN 失效
- 用 `curl -sI https://lioncc.ai/` 看 `last-modified` 是否已更新

### 2. lioncc.ai 无法访问
**检查清单**：
1. `dig lioncc.ai` 解析是否仍指向 `185.199.108-111.x`
2. `Jascenn/lioncc-website` Settings → Pages 配置是否仍绑 `lioncc.ai`
3. CNAME 文件是否仍存在于仓库根目录（`cat CNAME` 应输出 `lioncc.ai`）
4. HTTPS 证书是否过期（GitHub Pages 自动续，但被自身 bug 阻塞过；查 Settings → Pages 看证书状态）

### 3. GitHub Actions 部署失败
**查看**：https://github.com/Jascenn/lioncc-website/actions
- 失败常见原因：Tailwind build 报错（class 拼写错）、checkout permission、action 版本被弃用
- 修复后 push 一个空 commit 重新触发：`git commit --allow-empty -m "trigger redeploy" && git push`

### 4. GitHub commit 列表上又出现 Vercel 红 ❌
**原因**：你（或别人）重新把 GitHub 仓导入到 Vercel 了。
**修复**：要么走"回滚 Vercel 断开"步骤补好 `vercel.json`，要么直接断开 Git 连接：

```bash
curl -X DELETE "https://api.vercel.com/v9/projects/lioncc-website/link?teamId=<YOUR-VERCEL-TEAM-ID>" \
  -H "Authorization: Bearer <token>"
```

---

## 本地预览

```bash
# 在仓库目录下
python3 -m http.server 5180 --bind 127.0.0.1

# 浏览器访问
# http://127.0.0.1:5180/
```

按 ⌃+C 关闭。

---

## 最近更新

### 2026-04-27（本日多次推送）
- ✅ 新增 LionKit · 创作工坊产品卡（GPT Image 2 + Nano Banana 4K 多图编辑）
- ✅ 自研轻量 i18n 框架上线（`js/i18n.js` ~110 行 + `zh/en.json` 共 237 keys）
- ✅ 全站双语覆盖：首页 / 订阅弹窗 / privacy / terms / 教程页 chrome
- ✅ 主页 SEO meta 5 处同步 LionKit 与 GPT Image 2 创意社区
- ✅ 新增 VibeCodingAPI 创意社区产品卡（GPT Image 2 + prompt 案例库）
- ✅ 修复 privacy/terms 在 `/pages/` 下 `index.html` href 指向错误（→ `../index.html`）
- ✅ Vercel 副部署（`jascens-projects/lioncc-website`）通过 API 断开 Git 连接，仓库 commit 列表不再显示红 ❌（项目本体保留，可一键回滚）
- ✅ DEPLOYMENT.md 架构章节按实际链路重写

### 2026-04-26
- ✅ Claude 订阅充值教程页上线（含视频段，3 分 38 秒演示）
- ✅ 教程页对齐 ChatGPT Plus 模板
- ✅ SEO 三件套：sitemap.xml / robots.txt / 404.html / og-image.jpg
- ✅ Tailwind CDN 切换为本地 build（407KB → 24KB，-94%）
- ✅ 修复 terms/privacy 的 `css/styles.css` 路径 bug
- ✅ 引入 Bun + pre-commit hook 自动构建链

### 2024-12-04
- ✅ 添加 AI 批量生图工具产品卡片（外链 1024hub.xyz）
- ✅ 添加 CNAME 文件支持自定义域名

---

## 联系方式

- 仓库维护者：Jascenn
- 历史镜像（未启用）：LionCCAPI 组织

---

📝 文档更新日期：2026-04-27
