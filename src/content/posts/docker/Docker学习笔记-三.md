---
title: Docker学习笔记(三)：部署MySQL
published: 2025-08-14
tags: [Docker, 学习笔记]
---

在之前的服务器环境中，手动安装并配置MySQL的过程较为繁琐，因此我转而采用Docker容器化方案进行部署，通过标准化镜像和持久化存储机制，实现了更高效的数据库环境管理与版本控制。

这篇笔记就记录下用 Docker 部署 MySQL 的全过程，给自己留个存档。

## 一、准备工作

### 1. 搜索MySQL镜像（可选）

```bash
docker search mysql
```

❌问题：搜索出现超时，配置了国内镜像源也没用

### 2. 拉取MySQL 5.7镜像

因为听说指定版本拉取更稳妥，避免后续出现版本兼容问题，所以我选择了 5.7 版本：

```bash
docker pull mysql:5.7
```

### 3. 创建MySQL目录

```bash
mkdir -p ~/mysql/{log,data,conf}

# 进入创建好的mysql目录
cd ~/mysql
```

- log目录打算用来存 MySQL 的运行日志

- data目录很重要，用来存数据库的数据，这样就算容器没了，数据也还在

- conf目录用来放一些自定义的配置文件

## 二、部署MySQL容器

### 1. 运行MySQL容器

```bash
docker run -p 3307:3306 --name mysql \
-v $PWD/log:/var/log/mysql \
-v $PWD/data:/var/lib/mysql \
-v $PWD/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
```

✅ **参数说明**：

- -p 3307:3306`：端口映射（宿主机 3307 端口 → 容器 3306 端口，避免与宿主机本地 MySQL 冲突）
- `--name mysql`：容器命名（便于后续操作）
- `-v`：目录挂载（实现宿主机与容器文件共享，保障数据持久化）
- `-e MYSQL_ROOT_PASSWORD=123456`：设置 root 用户密码
- `-d`：后台运行容器
- `mysql:5.7`：指定使用的镜像
- **`$PWD`**它会动态记录你在终端中当前所在的目录的**绝对路径**，因为我们已经进入了mysql目录，所以这里是/root/mysql

### 2. 连接MySQL容器

在容器内部，使用 root 用户登录 MySQL：

```bash
# 进入运行中的容器
docker exec -it mysql bash

# 在容器内登录MySQL（注意：密码输入时无回显，输入完成直接回车）
mysql -u root -p
# 输入密码：123456（之前设置的root密码）
```

⚠️ **注意**：密码参数`-p`后无空格，直接接密码

## 三、创建远程访问用户并授权

执行以下 SQL 命令创建一个允许远程访问的用户（以用户名 admin为例）：

```sql
-- 创建用户（允许所有IP访问）
CREATE USER 'admin'@'%' IDENTIFIED BY 'your_password';

-- 授予所有权限（根据需要调整权限范围）
GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%' WITH GRANT OPTION;

-- 刷新权限使设置生效
FLUSH PRIVILEGES;
```

**权限说明**：

- '%' 表示允许从任何 IP 地址访问
- 如果你想限制特定 IP，可以将 % 替换为具体 IP，例如 '192.168.1.100'
- _._ 表示所有数据库的所有表，可根据需要限制为特定数据库，例如 appdb.\*
- ALL PRIVILEGES 可以替换为具体权限，如 SELECT,INSERT,UPDATE

## 补充：容器与镜像意外删后的恢复方法

在使用 Docker 的过程中，偶尔可能会误删容器或镜像，不必惊慌，只要我们做好了数据持久化，恢复工作会非常简单。以下是具体的恢复方法：

### 1. 容器被误删后的恢复

如果只是删除了容器（`docker rm`），但数据卷（volume）和镜像还在，恢复步骤如下：

**步骤1：确认数据目录是否完好**

```bash
# 检查之前挂载的数据目录
ls -l ~/mysql/data
```

如果能看到数据库文件（如 ibdata1、ib_logfile0 等），说明数据没有丢失

**步骤2：重新创建并启动容器**
使用与之前相同的运行命令即可，Docker 会自动使用现有数据目录：

```bash
docker run -p 3307:3306 --name mysql \
-v ~/mysql/log:/var/log/mysql \
-v ~/mysql/data:/var/lib/mysql \
-v ~/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
```

新容器会直接读取已有的数据文件，恢复到删除前的状态

### 2. 镜像被误删后的恢复

Docker 中，**镜像被删除的前提是关联容器已停止并删除**（否则会提示 “容器正在使用镜像”，无法删除）。因此镜像误删时，容器必然已不存在，需重新拉取镜像并重建容器。

```bash
(base) [root@iZ7xvcxkgs6i5l3z060714Z ~]# docker rmi mysql:5.7
Error response from daemon: conflict: unable to remove repository reference "mysql:5.7" (must force) - container 60d1ed6c60a6 is using its referenced image 5107333e08a8
```

恢复步骤：

**步骤1：重新拉取相同版本的镜像**

```bash
docker pull mysql:5.7
```

**步骤2：基于原有数据目录重建容器**

### 3. 预防措施

恢复的前提是 “数据未丢失”，因此提前预防比事后恢复更重要。建议做好以下 3 点：

**3.1 定期备份数据目录**

```bash
# 压缩备份数据目录
# 格式：tar -zcvf 备份文件名 目标目录
tar -zcvf mysql_backup_$(date +%Y%m%d).tar.gz ~/mysql/data
```

**如何从备份恢复**？

如果数据目录丢失，可从备份文件恢复：

```bash
# 解压备份到数据目录（确保目录存在）
tar -zxvf ~/mysql_backup_20250815.tar.gz -C ~/mysql/
# 解压后会自动覆盖~/mysql/data目录，再重建容器即可
```

**3.2 导出容器配置**

```bash
# 创建启动脚本
cat > start_mysql.sh << 'EOF'
#!/bin/bash
docker run -p 3307:3306 --name mysql \
-v ~/mysql/log:/var/log/mysql \
-v ~/mysql/data:/var/lib/mysql \
-v ~/mysql/conf:/etc/mysql/conf.d \
-e MYSQL_ROOT_PASSWORD=123456 \
-d mysql:5.7
EOF

# 赋予执行权限
chmod +x start_mysql.sh
```

**3.3 慎用删除命令**
执行删除操作前先确认：

```bash
# 查看所有容器（包括停止的）
docker ps -a
# 查看所有镜像
docker images
```

## 四、小结

通过Docker容器化部署MySQL，我成功解决了手动安装配置MySQL的繁琐问题，实现了数据库环境的快速部署与管理。同时，容器化还带来了环境隔离、版本控制、迁移方便等优势，为后续的应用开发提供了更可靠的基础。

其他软件如Nginx、Redis、Tomcat等也可以采用类似的方式进行容器化部署，极大地简化了应用的运维管理。
