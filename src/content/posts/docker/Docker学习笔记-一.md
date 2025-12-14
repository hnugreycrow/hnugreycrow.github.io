---
title: Docker学习笔记(一)：Docker常用命令
published: 2025-08-13
category: 学习笔记
tags: [Docker]
---

整理了 Docker 核心命令的用法，从服务管理到容器操作，方便后续复习查阅。

## 一、Docker服务基础操作（守护进程管理）

### 1.1 服务启停控制

- 启动：`systemctl start docker`  
  ✅ 核心功能：启动Docker守护进程（dockerd），初始化镜像/容器管理环境  
  ⚠️ 注意：启动失败用`journalctl -u docker`查日志
- 停止：`systemctl stop docker`  
  ✅ 核心功能：终止守护进程及所有运行中容器  
  ⚠️ 注意：先手动停止重要容器，避免数据未持久化
- 重启：`systemctl restart docker`  
  ✅ 核心场景：修改配置文件（如`/etc/docker/daemon.json`）后生效

### 1.2 服务状态查询

- 命令：`systemctl status docker`  
  ✅ 核心功能：查看服务运行状态及最近日志  
  🔍 状态解读：
  - 绿色`active (running)`：正常运行
  - 红色`inactive (dead)`：已停止

## 二、镜像操作命令（Image）

### 2.1 镜像获取与搜索

- 拉取镜像：`docker pull <镜像名:标签>`  
  ✅ 核心功能：从远程仓库下载镜像（默认Docker Hub）  
  🔍 格式示例：`docker pull mysql:8.0`（指定版本，推荐生产环境使用）  
  ⚠️ 注意：`latest`标签可能随时间变化，避免生产环境直接使用

- 搜索镜像：`docker search <关键词>`  
  ✅ 核心功能：在Docker Hub检索镜像  
  🔍 结果解读：`OFFICIAL=OK`为官方镜像（安全性更高）  
  ❌ 常见问题：网络超时（`i/o timeout`）→ 需配置国内镜像源

### 2.2 镜像管理与查询

- 查看本地镜像：`docker images`  
  ✅ 核心功能：列出本地所有镜像信息  
  🔍 输出解读：`REPOSITORY`（仓库名）、`TAG`（版本）、`IMAGE ID`（唯一标识）  
  ⚡ 快捷用法：`docker images -q`（仅输出镜像ID，用于批量操作）

- 查看镜像详情：`docker inspect <镜像ID/名称>`  
  ✅ 核心功能：获取镜像完整元数据（构建历史、环境变量等）

### 2.3 镜像删除

- 命令：`docker rmi <镜像ID/名称>`  
  ✅ 核心功能：删除本地镜像  
  ⚠️ 注意：若镜像被容器引用（即使容器已停止），需先删除容器  
  ⚡ 强制删除：`docker rmi -f <镜像ID>`（不推荐，可能残留数据）

## 三、容器操作命令（Container）

### 3.1 容器创建与启动

- 新建并启动：`docker run [参数] <镜像名>`  
  ✅ 核心功能：基于镜像创建并启动容器（= 新建+启动）  
  ⚡ 必学参数：
  - `-d`：后台运行（不占用终端）
  - `-p 主机端口:容器端口`：端口映射（如`-p 8080:80`）
  - `--name <名称>`：指定容器名（避免随机名称）
  - `-it`：交互式终端（如`docker run -it ubuntu /bin/bash`）

- 启动已停止容器：`docker start <容器ID/名称>`  
  ✅ 核心区别：`start`用于“启动已存在容器”，`run`用于“新建+启动”

### 3.2 容器查看与进入

- 查看容器列表：
  - `docker ps`：查看运行中容器
  - `docker ps -a`：查看所有容器（含已停止）
  - `docker ps -q`：仅输出容器ID（批量操作如`docker stop $(docker ps -q)`）

- 进入运行中容器：`docker exec -it <容器ID/名称> <终端命令>`  
  ✅ 示例：`docker exec -it my-nginx /bin/bash`（进入bash终端）  
  ⚠️ 注意：需容器处于运行状态，`-it`参数缺一不可（保持交互）

### 3.3 容器停止与销毁

- 停止容器：`docker stop <容器ID/名称>`  
  ✅ 核心功能：优雅停止（发送SIGTERM信号，允许保存数据）  
  ⚡ 强制停止：`docker kill <容器ID>`（发送SIGKILL，紧急情况使用）

- 删除容器：`docker rm <容器ID/名称>`  
  ✅ 核心功能：删除已停止容器  
  ⚠️ 注意：运行中容器需先停止，或用`docker rm -f <容器ID>`强制删除（谨慎使用）

### 3.4 容器详情查询

- 命令：`docker inspect <容器ID/名称>`  
  ✅ 核心用途：查看IP地址、挂载路径等关键信息（如`NetworkSettings.IPAddress`）

## 四、常见问题与易错点

### 4.1 网络问题

- 现象：拉取/搜索镜像超时（`i/o timeout`）
- 解决：配置国内镜像源（如阿里云、网易），修改`/etc/docker/daemon.json`后重启服务

### 4.2 命令混淆

| 易混淆命令                     | 核心区别                                |
| ------------------------------ | --------------------------------------- |
| `docker run` vs `docker start` | `run`=新建+启动；`start`=启动已存在容器 |
| `docker stop` vs `docker kill` | `stop`优雅停止；`kill`强制终止          |
| `docker rmi` vs `docker rm`    | `rmi`删镜像；`rm`删容器                 |

## 五、学习小结

### 核心逻辑链

服务（daemon）→ 镜像（模板）→ 容器（运行实例），操作需按“启动服务→管理镜像→操作容器”递进

### 后续重点

1. 配置国内镜像源，解决网络问题
2. 学习数据卷（`volume`），解决容器数据持久化
3. 实战部署（Nginx/MySQL），练习命令组合使用
