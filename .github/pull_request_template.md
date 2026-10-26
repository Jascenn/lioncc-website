## 背景

<!-- 说明用户问题、内容目标或关联的 issue。 -->

Closes #

## 改了什么

-

## 内容与本地化

- [ ] 如果改页面可见内容，同步核对 `js/i18n.js` 和所有语言键
- [ ] 如果改教程页，检查桌面和 390px 移动端布局
- [ ] 不提交 `.playwright-cli/`、`.wrangler/`、`output/` 或本地备份文件
- [ ] 涉及付费产品说明时，没有写未经核实的承诺或价格

## 如何验证

- [ ] `bun run build` 通过
- [ ] 如果改 Tailwind 系页面，`css/tailwind.css` 已同步更新
- [ ] GitHub Pages 预览或本地静态服务可以打开改动页面
- [ ] 截图附在 PR，移动端和桌面端都要有

## 发布与回滚

- [ ] 只合并已经通过 `deploy` workflow 的提交
- 回滚方式：revert 本 PR 后重新触发 Pages 部署
