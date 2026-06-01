---
title: "Docker低版本下容器启动失败？试试 security_opt: seccomp:unconfined"
date: 2026-05-31 23:47:00
cover: /img/posts/docker.png
tags:
  - Docker
  - 技术踩坑
categories: 
  - Docker
---

## 问题现象

在低版本 Docker 环境（如 20.10.7 ）中，某些服务（如 MySQL、Spring Boot 后端）容器启动时报错，无法正常运行。但在高版本 Docker 上完全正常。

容器启动失败后，先查看日志，确认报错类型：

```bash
# 查看容器日志
docker logs <容器名或ID>

# 实时跟踪日志
docker logs -f <容器名或ID>

# 查看最近 100 行日志
docker logs --tail 100 <容器名或ID>
```

```
# There is insufficient memory for the Java Runtime Environment to continue.
# Cannot create worker GC thread. Out of system resources.
[0.006s][warning][os,thread] Failed to start thread "GC Thread#0" 
- pthread_create failed (EPERM) for attributes: stacksize: 1024k, guardsize: 4k, detached.
```

MySQL 则可能表现为反复重启，或提示 `Operation not permitted`。

**注意**：这里的 `EPERM`（权限错误）是核心线索。报错看起来像"内存不足"，实际上是**操作系统拒绝了线程创建请求**，JVM 因无法启动垃圾回收线程而判定"无法继续运行"。

## 原因简述

Docker 默认启用 **Seccomp**（安全计算模式）来限制容器内的系统调用。低版本 Docker（<< 20.10.10）自带的 seccomp 配置较旧，**不认识新版 glibc 使用的 `clone3` 等系统调用**，于是直接拦截并返回 `EPERM`。

而新版 JDK（基于 glibc 2.34+）、MySQL 8.0+ 在启动时需要这些调用，于是被"误伤"。

## 临时解决

在 `docker-compose.yml` 中给对应服务加上：

```yml
services:
  mysql:
    image: mysql:8.0
    security_opt:
      - seccomp:unconfined
    # ... 其他配置
```

seccomp:unconfined 的意思是：关闭 Seccomp 限制，让容器内的程序可以正常执行所需的系统调用。

## 我的实际配置

以下是我项目中受影响的服务：

```yml
services:
  mysql:
    image: mysql:8.0
    security_opt:
      - seccomp:unconfined
    # ...

  backend:
    build: ./backend
    security_opt:
      - seccomp:unconfined
    # ...
```

> **注意**：Redis、Nginx 等轻量服务通常不需要加，可以先不加，出问题了再补。

## 更好的方案

`seccomp:unconfined` 会降低容器安全性，**最佳做法是升级 Docker**：

```bash
# Ubuntu/Debian 示例
sudo apt update
sudo apt install docker-ce libseccomp2
```

升级后，通常可以**直接删掉所有 `security_opt` 配置**。

## 总结

| 方案                 | 适用场景           | 安全性 |
| -------------------- | ------------------ | ------ |
| `seccomp:unconfined` | 临时解决、本地开发 | 较低   |
| 升级 Docker          | 长期方案、生产环境 | 高     |

如果暂时无法升级 Docker，给 MySQL、Java 后端加上 `security_opt: seccomp:unconfined` 是最快的解决办法。
