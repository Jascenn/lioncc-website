# LIONCC.AI

OpenAI 自动充值系统。

## 关于

LIONCC.AI 当前公开保留 OpenAI 自动充值系统，支持 ChatGPT 帐号充值与 ChatGPT Plus 会员充值。

## 产品

- ChatGPT 帐号充值
- ChatGPT Plus 会员充值
- 站内图文与视频教程

## 网站

🌐 [https://lioncc.ai](https://lioncc.ai)

## 本地开发

仓库分两套子系统：
- **Tailwind 系**（`index.html` / `pages/terms.html` / `pages/privacy.html` / `js/main.js` / `js/subscription-modal.js`）：依赖 `css/tailwind.css`，需要 build。
- **Tutorial 系**（`pages/*-guide.html`）：用手写 `css/tutorial-guide.css`，不需要 build。

### 首次 clone 后

```bash
bun install                              # 装 Tailwind CLI
git config core.hooksPath .githooks      # 启用 pre-commit 自动 build hook
```

### 改了 Tailwind 系文件后

正常 `git commit` 即可——pre-commit hook 自动跑 `bun run build` 并把 `css/tailwind.css` 一起提交。

手动 build：`bun run build`

---

© 2025-2026 LIONCC.AI 版权所有
