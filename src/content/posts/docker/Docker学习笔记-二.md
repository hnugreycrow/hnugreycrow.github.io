---
title: Docker学习笔记(二)：容器数据卷
published: 2025-08-14
tags: [Docker, 学习笔记]
---

## 一、数据卷核心概念

### 1.1 定义

**数据卷是宿主机文件系统中的一个目录或文件**，通过挂载机制与容器内指定路径关联，实现宿主机与容器的双向数据共享。

### 1.2 本质

- 类似Linux的`mount`命令，容器访问挂载路径时实际操作的是宿主机数据卷
- 数据卷独立于容器生命周期，容器删除后数据仍保存在宿主机

## 二、数据卷的三大核心作用

数据卷的设计初衷，就是为了解决容器与数据分离的问题，其核心作用可以概括为三点：

### 2.1 容器数据持久化

- **场景**：数据库、日志文件等需要长期保存的数据
- **案例**：MySQL容器挂载数据卷后，即使容器崩溃，数据库文件仍可通过数据卷恢复

### 2.2 宿主机与容器双向交互

- **实时同步特性**：
  - 宿主机修改卷目录文件 → 容器内立即生效（如本地代码编辑后容器热更新）
  - 容器生成数据（日志、配置）→ 实时同步到宿主机（方便本地查看分析）

### 2.3 多容器数据共享

- **场景**：前端容器与后端容器共享静态资源、多个服务共享配置文件
- **案例**：Nginx（展示静态页）与Node.js（生成静态页）通过数据卷自动同步资源

## 三、数据卷的基础操作实践

### 3.1 创建并挂载数据卷（基础命令）

使用docker run命令时，通过-v参数可以直接创建并挂载数据卷：

```bash
# 语法：docker run -v 宿主机路径:容器内路径 [其他参数] 镜像名
docker run -d \
  -p 8080:80 \
  -v /root/nginx/myapp:/usr/share/nginx/html \  # 挂载数据卷
  --name mynginx \
  nginx
```

上述命令的含义是：

- 启动一个名为mynginx的 Nginx 容器；

- 将宿主机的/root/nginx/myapp目录（若不存在会自动创建）挂载到容器内的/usr/share/nginx/html（Nginx 默认静态文件目录）；

- 此时在宿主机/root/nginx/myapp中放入index.html，访问[http://localhost:8080](http://localhost:8080/)即可看到页面。

### 3.2. 查看挂载详情

通过docker inspect命令可以查看容器的挂载详情：​

```bash
docker inspect mynginx​
```

在输出的 JSON 结果中，找到Mounts字段，会显示如下信息：

```typescript
"Mounts": [​
    {​
        "Type": "bind",​
        "Source": "/root/nginx/myapp",  // 宿主机目录​
        "Destination": "/usr/share/nginx/html",  // 容器内目录​
        "Mode": "",
        "RW": true,  // 读写权限（默认可读写）​
        "Propagation": "rprivate"​
    }​
]​
```

## 四、数据卷容器：简化多容器共享场景

当多个容器需要共享数据时，逐一为每个容器配置-v参数会显得繁琐。**数据卷容器**（Volume Container）正是为简化这种场景而生。

### 4.1 什么是数据卷容器？

- 专门用于管理数据卷的 "中介容器"，其他容器通过`--volumes-from`继承其挂载配置
- 优势：简化多容器挂载配置，统一管理数据卷路径

### 4.2 使用步骤

#### 步骤 1：创建数据卷容器

```bash
# 创建仅用于挂载数据卷的容器（无需运行服务）
docker run -it \
  -v /data:/shared-data \  # 定义数据卷
  --name volume-container \  # 命名数据卷容器
  ubuntu /bin/bash
```

#### 步骤 2：其他容器继承挂载配置

```bash
# 容器A继承数据卷
docker run -it --volumes-from volume-container --name container-A ubuntu /bin/bash

# 容器B继承数据卷（与A共享同一数据卷）
docker run -it --volumes-from volume-container --name container-B ubuntu /bin/bash
```

- **效果**：容器 A、B 与宿主机`/data`目录实时同步数据

### 4.3 注意事项

1. 数据卷容器停止 / 删除后，其他容器仍可正常使用数据卷
2. 彻底清理数据卷需手动删除宿主机对应目录（如`/data`）
3. 可多层继承（容器 A 继承自数据卷容器，容器 B 继承自容器 A）

## 五、复习要点总结

1. **核心目标**：解决 "容器临时性" 与 "数据持久性" 的矛盾
2. **基础命令**：`-v`挂载、`docker inspect`查看、`--volumes-from`继承
3. **关键区别**：
   - 普通挂载：直接指定宿主机路径（适合单容器）
   - 数据卷容器：通过中介容器管理（适合多容器共享）
