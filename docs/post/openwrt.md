---
title: 面向小白的软路由入门指南
date: 2022-04-30
excerpt: "
OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。"
tags:

- OpenWrt
- 软路由
- OpenClash
- Docker
- uu加速器
- samba
- aria

---

# 面向小白的软路由入门指南

演示的软路由型号为友善R4S

[//]: # (todo)

## 为什么需要一台软路由

[//]: # (todo)

## 软路由需要安装什么系统

## 软件安装

### Docker

#### 安装
```shell
opkg install docker dockerd docker-compose
```
#### 管理页面
**需要打开防火墙转发，Luci > 网络 > 防火墙 > 转发：接受**
```shell
#创建一个卷，来供管理工具存储数据
docker volume create portainer_data

#拉取Docker镜像
docker pull portainer/portainer-ce:linux-arm64

#运行Docker容器
docker run -d -p 8000:8000 -p 9443:9443 --name portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer-ce:linux-arm64
```
访问地址：`htpps://192.168.1.1:9443`

创建用户名和密码
#### 运行Debian容器
```shell
docker pull debian
docker run -it --name debian debian /bin/bash
```
### Samba

#### 介绍
Samba 是一组不同功能程序组成的应用集合，它能让 Linux 服务器实现文件服务器、身份授权和认证、名称解析和打印服务等功能。
Samba分为服务端和客户端，本次我们打算将软路由上作为文件共享中心，因此需要在软路由上安装Samba的服务端。客户端的话，因为现代的操作系统默认都支持SMB协议，所以只需要稍加配置即可启用

#### 安装Samba

在 `System` -> `Software` 中安装samba的服务端 `samba4-server` ,以及可视化配置页面 `luci-app-samba4`
![openwrt_install_samba.png](/post/openwrt/openwrt_install_samba.png)

#### 添加用户

   ```shell
   opkg install shadow-useradd # 安装'useradd'，目的是为了创建用户
   useradd samba # 新建一个用户,名字叫'samba'
   smbpasswd -a samba #为用户samba创建密码，看到'Added user samba.'表示用户成功添加到samba中了
   mkdir -p /opt/samba # 创建一个文件夹用于samba共享，可以自己随意设置
   chown -R samba:samba /opt/samba #使用户samba获得文件夹权限
   ```

#### 软件配置

1. 进入Samba配置页面： `Services` -> `Network Shares`
2. 共享目录，注意 `Path` 一定要选之前创建的，例如我的就是 `/opt/samba`，其他的可以参照我的截图来
   ![shared_directories](/post/openwrt/shared_directories.png)
3. 兼容苹果设备访问(建议打开)
   ![macOS_compatible](/post/openwrt/macOS_compatible.png)

#### 其他平台访问方式

1. Windows
   1. 在启用或关闭windows功能中打开 `SMB 1.0/CIFS 文件共享支持` 和 `SMB直通`
      ![windows_samba_enable](/post/openwrt/windows_samba_enable.png)
   2. 打开文件夹，访问samba服务地址，例如 `smb://192.168.1.1`，然后回车
   3. 按照提示输入用户名和密码即可成功连接
      ![windows_samba.png](/post/openwrt/windows_samba.png)
2. Mac
   1. 打开finder
   2. 按下快捷键 `⌘` + `K` 打开连接
   3. 输入samba的服务器地址，例如 `smb://192.168.1.1`，点击连接
   4. 按照提示输入用户名和密码即可成功连接
      ![mac_finder_samba](/post/openwrt/mac_finder_samba.png)
3. iPhone/iPad
   1. 打开文件 -> 浏览，然后点击右上角 更多 -> 连接服务器
      ![iOS_samba_connect.png](/post/openwrt/iOS_samba_connect.png)
   2. 输入samba的服务器地址，例如 `smb://192.168.1.1`，点击连接
   3. 按照提示输入用户名和密码即可成功连接
      ![iOS_samba_display.png](/post/openwrt/iOS_samba_display.png)
