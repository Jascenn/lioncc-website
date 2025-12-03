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
├── .github/
│   └── workflows/
│       └── deploy.yml          # 自动部署配置
├── css/
│   └── styles.css              # 样式文件
├── js/
│   └── main.js                 # JavaScript 文件
├── images/                     # 图片资源
├── pages/                      # 其他页面
├── index.html                  # 首页
├── CNAME                       # 域名配置
└── README.md                   # 项目说明
```

## 最近更新

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

📝 文档更新日期：2024-12-04
