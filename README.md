<div align="center">
  <h1>LIONCC.AI</h1>
  <p><strong>新一代 AI 生态，驱动未来代码与算力。</strong></p>
  <p>为开发者、内容创作者和商业用户提供从 AI 编程算力到 Sora 视频生成的全栈 AI 基础设施。</p>
  <p>
    <a href="https://lioncc.ai"><img src="https://img.shields.io/badge/%E7%BA%BF%E4%B8%8A%E5%9C%B0%E5%9D%80-lioncc.ai-111827?style=flat-square" alt="lioncc.ai" /></a>
  </p>
</div>

## 产品

<table>
  <tr>
    <td width="50%"><strong>AI 编程算力拼车</strong></td>
    <td width="50%"><strong>多模型统一 API 接入</strong></td>
  </tr>
  <tr>
    <td><strong>Sora-2 文生视频</strong></td>
    <td><strong>Gemini 多模态创作</strong></td>
  </tr>
</table>

## 本地开发

仓库分两套子系统：

| 子系统 | 文件 | 说明 |
| --- | --- | --- |
| Tailwind 系 | `index.html` / `pages/terms.html` / `pages/privacy.html` / `js/main.js` / `js/subscription-modal.js` | 依赖 `css/tailwind.css`，需要 build |
| Tutorial 系 | `pages/*-guide.html` | 手写 `css/tutorial-guide.css`，不需要 build |

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
