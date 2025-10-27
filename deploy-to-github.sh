#!/bin/bash

echo "🚀 准备部署到 GitHub Pages..."
echo ""

# 检查是否设置了 GitHub 用户名
if [ -z "$1" ]; then
    echo "❌ 请提供 GitHub 用户名"
    echo ""
    echo "用法: ./deploy-to-github.sh YOUR_USERNAME"
    echo ""
    echo "示例: ./deploy-to-github.sh jascen"
    exit 1
fi

USERNAME=$1
REPO_NAME="lioncc-website"

echo "📋 配置信息:"
echo "  - GitHub 用户名: $USERNAME"
echo "  - 仓库名称: $REPO_NAME"
echo ""

# 添加远程仓库
echo "🔗 添加远程仓库..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# 设置主分支
echo "🌿 设置主分支..."
git branch -M main

# 推送到 GitHub
echo "📤 推送到 GitHub..."
echo ""
echo "⚠️  请确保已经创建了 GitHub 仓库: $REPO_NAME"
echo "   访问: https://github.com/new"
echo ""
read -p "是否已创建仓库? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push -u origin main
    echo ""
    echo "✅ 部署完成！"
    echo ""
    echo "下一步:"
    echo "1. 访问: https://github.com/$USERNAME/$REPO_NAME"
    echo "2. Settings -> Pages"
    echo "3. Source: Deploy from a branch"
    echo "4. Branch: main, 文件夹: / (root)"
    echo "5. Save"
    echo ""
    echo "网站地址: https://$USERNAME.github.io/$REPO_NAME"
else
    echo "❌ 部署已取消"
    echo "请先创建 GitHub 仓库，然后重新运行此脚本"
fi
