# 使用自定义域名部署 GitHub Pages

## 📋 前置条件

1. ✅ 已创建 GitHub 仓库
2. ✅ 已推送到 GitHub
3. ✅ 已启用 GitHub Pages
4. ✅ 有一个域名

## 🚀 配置步骤

### 步骤 1：在 GitHub 添加自定义域名

1. 访问仓库：https://github.com/Jascenn/lioncc-website/settings/pages
2. 在 "Custom domain" 输入框输入你的域名
   - 例如：`lioncc.ai` 或 `www.lioncc.ai`
3. 点击 Save（保存）

### 步骤 2：配置 DNS

在你的域名服务商（如阿里云、腾讯云、Cloudflare 等）添加 DNS 记录：

**⚠️ 重要提示：添加记录前先检查是否已存在**

在添加 DNS 记录之前：
1. 查看现有的 DNS 记录列表
2. 如果已存在相同类型、主机名和记录值的记录，不需要重复添加
3. 如果系统提示"记录已存在"，说明该记录已经配置好了

#### 方案 A：使用 A 记录（推荐）

如果**没有**已存在的 A 记录，添加以下 4 条 A 记录：

```
类型：A
主机：@
记录值：185.199.108.153
TTL：600

类型：A
主机：@
记录值：185.199.109.153
TTL：600

类型：A
主机：@
记录值：185.199.110.153
TTL：600

类型：A
主机：@
记录值：185.199.111.153
TTL：600
```

**说明：**
- 这 4 条记录都是针对根域名（@）的 A 记录，只是 IP 地址不同
- 这 4 个 IP 地址都必须添加，不能只添加一个
- 如果系统提示某条记录已存在，检查记录值是否一致，一致则跳过

或者配置 www 子域名：

```
类型：CNAME
主机：www
记录值：jascenn.github.io
TTL：600
```

**说明：**
- 如果已存在指向 `jascenn.github.io` 的 CNAME 记录，无需重复添加

### 步骤 3：等待 DNS 生效

- DNS 生效时间：通常 5-15 分钟，最长 24 小时
- GitHub 验证：1-2 分钟

### 步骤 4：验证

访问你的域名查看是否正常显示。

## 🔧 常见问题

### DNS 配置后 GitHub Pages 不工作？

1. 检查 DNS 是否已生效：
   ```bash
   nslookup your-domain.com
   ```

2. 检查 GitHub Pages 设置中的自定义域名是否正确

3. 等待 24 小时让 DNS 完全生效

### 想使用 HTTPS？

GitHub Pages 会自动为自定义域名配置 SSL 证书（Let's Encrypt），通常需要等待几分钟到几小时。

## ✅ 完成后的结果

- 使用 GitHub 地址访问：https://jascenn.github.io/lioncc-website
- 使用自定义域名访问：https://your-domain.com
- 两者都可以访问到网站

## 📝 注意事项

1. **不要同时使用多种 DNS 记录类型**（A 和 CNAME）
2. **如果配置了 A 记录，不要配置 CNAME**
3. 如果想使用 www 子域名，同时配置 @ 和 www 的 A 记录
4. 确保在 GitHub Pages 设置中输入的域名与 DNS 配置的域名一致
5. **避免重复添加相同的 DNS 记录**
   - 如果系统提示"记录已存在"或"已有相同的指向"，说明记录已配置，无需重复添加
   - 添加前先检查现有记录，确认是否已经存在相同配置

