---
title: Electron中导入better-sqlite3：为什么import不行，require却可以？
published: 2025-09-01
category: 技术踩坑
tags: [Electron, ESM, CommonJS]
---

在Electron开发过程中，我遇到一个有趣的问题：使用`import Database from "better-sqlite3"`导入模块时，不仅出现类型声明文件缺失的警告，还会报`__filename is not defined`的运行时错误。而换成`const Database = require("better-sqlite3")`后，一切正常。这个现象背后，其实是JavaScript两种主流模块系统——ESM与CommonJS的差异在作祟。

## 问题现象与直接原因

当使用ES模块语法导入better-sqlite3时，会遇到两个问题：

1. 类型检查错误：`无法找到模块“better-sqlite3”的声明文件`
2. 运行时错误：`ReferenceError: __filename is not defined`

而切换到CommonJS的require语法后，这两个问题都消失了。要理解其中的原因，我们需要先深入了解ESM与CommonJS这两种模块系统的核心差异。

## 模块化的两种 "流派"：ESM 和 CommonJS

JavaScript 一开始是没有 "模块" 概念的，后来为了让代码更好管理，才出现了两种主流的模块系统：

### 1. CommonJS：Node.js 的 "老规矩"

**诞生背景**：2009 年前后，Node.js 刚出来，需要一套规则管理服务器端的代码（比如读取文件、操作数据库），于是 CommonJS 就成了 Node.js 的 "默认规范"。

**核心特点**：

- 用`require`导入模块，用`module.exports`导出模块

- 比如：

  ```javascript
  // 导出（math.js）
  function add(a, b) { return a + b; }
  module.exports = { add };
  
  // 导入（app.js）
  const math = require('./math'); // 可以省略.js后缀
  math.add(1, 2); // 结果是3
  ```

- 运行时才加载模块，支持 "动态导入"（比如在`if`条件里加载不同模块）

- 每个模块里自带几个 "全局变量"：`__filename`（当前文件路径）、`__dirname`（当前文件夹路径），方便处理文件路径

### 2. ESM：浏览器和 Node.js 通用的 "新规范"

**诞生背景**：后来前端项目越来越大，也需要模块化。2015 年 ES6 推出了 ESM（ES Modules），想统一浏览器和服务器的模块化标准。

**核心特点**：

- 用`import`导入模块，用`export`导出模块

- 比如：

  ```javascript
  // 导出（math.js）
  export function add(a, b) { return a + b; }
  
  // 导入（app.js）
  import { add } from './math.js'; // 必须写全.js后缀
  add(1, 2); // 结果是3
  ```

- 加载前先分析依赖（编译时静态分析），不支持在`if`里动态导入

- 没有`__filename`、`__dirname`这些变量（设计上更 "纯粹"，不绑定 Node.js 的文件系统）

## 关键差异：为什么这些区别会导致报错？

回到开头的问题：`better-sqlite3`为啥认`require`不认`import`？

关键就在 **CommonJS 的 "全局变量"** 上。

`better-sqlite3`是一个 "Node.js 原生扩展"（底层用 C++ 写的，需要操作本地文件），它的代码里可能直接用了`__filename`来处理路径（比如找数据库文件的位置）。

当你用`import`时：

- 代码会按 ESM 规范运行，环境里没有`__filename`这个变量
- `better-sqlite3`找不到这个变量，就会报`ReferenceError`

当你用`require`时：

- 代码会按 CommonJS 规范运行，`__filename`这些变量自动存在
- `better-sqlite3`能正常找到需要的变量，自然就不报错了

在我的 Electron + Vue + Vite 项目中，整个项目采用 ES 模块（ESM）规范开发，并通过`package.json`中配置`"type": "module"`实现了统一的模块化管理。

针对`better-sqlite3`这类依赖 CommonJS 环境的模块，我们通过以下方式解决了 ESM 下的导入兼容问题：

```typescript
// 在ES模块中模拟CommonJS的require功能（因为Electron有时需要使用CommonJS模块）
const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");
```

通过`createRequire`从当前模块的`import.meta.url`创建一个兼容 CommonJS 的`require`函数，既保留了项目整体的 ESM 规范，又能顺利导入`better-sqlite3`这类依赖传统 CommonJS 特性的模块，确保了项目的正常运行。

## 类型声明问题：另一个小插曲

开头还提到 "找不到声明文件" 的警告，这是 TypeScript 的 "小脾气"：

- `better-sqlite3`本身是用 JavaScript/C++ 写的，没有自带 TypeScript 的类型说明

- 解决办法很简单：安装社区提供的类型声明文件

  ```bash
  npm install @types/better-sqlite3 --save-dev
  ```

  （但这只能解决类型提示问题，解决不了`__filename`的报错，因为那是运行时问题）

## 总结：该用 import 还是 require？

简单说，看模块 "脾气"：

1. 像`better-sqlite3`这种依赖 Node.js 原生特性（比如`__filename`）的模块，优先用`require`
2. 纯 JavaScript 写的现代模块（尤其是前端库），可以用`import`
3. 如果项目里两种模块都有，可以混合使用（Electron 支持这种混合模式）

ESM 是未来的趋势（浏览器和 Node.js 都在推广），但很多 Node.js 原生模块还依赖 CommonJS 的特性。了解这两种规范的区别，能帮你少踩很多 "导入报错" 的坑～
