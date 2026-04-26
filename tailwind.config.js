/** @type {import('tailwindcss').Config} */
module.exports = {
  // 扫描所有用到 Tailwind class 的 HTML 文件 + JS 模板字符串
  content: [
    './index.html',
    './pages/*.html',
    './js/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
