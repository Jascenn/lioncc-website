# Changelog

All notable changes to this project will be documented in this file.

## [2026-10-09]

### Added
- 🔗 **粘连网址识别面板**（`404.html`，原生 JS，无依赖）
  - 识别地址栏里粘连在一起的多条网址（思路来源：@gefei55）
  - 兼容浏览器/网关把 `https://` 压成 `https:/` 的情况
  - 自动拆分并提供复制、打开按钮

### Changed
- 🎨 **404 页面风格对齐网站整体**（`404.html`）
  - 纯白底（#fcfcfc）、#111827 主色、超大 font-black 标题、LXGW WenKai 站点同款字体
  - 顶部加入 Lion CC logo；深色"返回首页"主按钮 + 2px 描边"产品矩阵"次按钮

### Added
- 📝 **更新日志页**（`pages/updates.html`）
  - 页脚"技术与支持"栏目新增"更新日志"入口（含中英翻译）
