---
title: 一个剪贴板管理工具
date: 2025-11-07 21:10:19
cover: img/posts/MemoPaste.png
categories:
  - 其他
tags:
  - Electron
  - Vue
---

**MemoPaste** 是一款基于 **Electron + Vue 3** 构建的剪贴板管理工具，自动记录每一次复制，并提供了优雅的检索与复用体验，让你从此告别“刚刚复制的内容去哪了”的尴尬。

## ✨ 特性一览

| 功能        | 说明                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| 📋 历史记录 | 自动保存复制的文本，支持关键词搜索、按时间筛选与收藏标记                  |
| 💾 本地存储 | 数据保存在 SQLite 中，无需联网，隐私完全由你掌控                          |
| ⌨️ 快捷面板 | 全局快捷键唤出浮层面板（类似 Win + V 体验），选中条目后自动粘贴至当前窗口 |
| 🖥️ 系统托盘 | 支持最小化到托盘，后台静默运行，不打扰工作流                              |
| 🗂️ 数据管理 | 可配置历史保留天数，支持批量删除与一键清空                                |
| 🌓 主题切换 | 内置亮色 / 暗色主题，随系统或手动切换                                     |
| 🔄 自动更新 | 通过 GitHub Releases 检查更新，及时获取新特性与修复                       |

---

## 🖼️ 预览

![MemoPaste 主界面](img/posts/MemoPaste.png)

---

## 🧰 技术栈

| 类别      | 技术                                     |
| --------- | ---------------------------------------- |
| 前端框架  | Vue 3 + TypeScript                       |
| 状态管理  | Pinia                                    |
| 路由      | Vue Router                               |
| UI 组件库 | Element Plus                             |
| 构建工具  | Vite + vite-plugin-electron              |
| 桌面框架  | Electron                                 |
| 本地存储  | SQLite (better-sqlite3) + electron-store |

---

## 🚀 快速开始

### 方式一：直接下载安装包

前往 [GitHub Releases](https://github.com/hnugreycrow/MemoPaste/releases) 下载对应平台的安装包（支持 Windows、macOS、Linux），双击即可安装使用。

### 方式二：从源码运行

适合开发者或希望自行编译的用户：

**环境要求**：Node.js 18+（推荐 LTS 版本）

```bash
# 克隆仓库
git clone https://github.com/hnugreycrow/MemoPaste.git
cd MemoPaste

# 安装依赖
npm install

# 若遇到 better-sqlite3 原生模块编译问题，执行
npm run sqlite3-rebuild

# 启动开发环境
npm run dev
```

## 📎 相关链接

- GitHub 仓库：[hnugreycrow/MemoPaste](https://github.com/hnugreycrow/MemoPaste)
- 下载页面：[Releases](https://github.com/hnugreycrow/MemoPaste/releases)
- 问题反馈：[Issues](https://github.com/hnugreycrow/MemoPaste/issues)
