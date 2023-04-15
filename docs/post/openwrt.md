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
  - 游戏加速器
  - samba
  - aria2

---

# 面向小白的软路由入门指南

> 本文演示的软路由型号为友善R4S，其使用ARM v8芯片，相比传统的X86芯片能耗更低，更适合软路由系统

## 介绍

类似于计算机有软件和硬件的概念，在路由器领域，我们习惯把常用的可以发射Wi-Fi信号的设备称为“硬路由”，而把没有无线功能，但是运行着路由系统的设备称为“软路由”

- 硬路由的特点：无线信号强，稳定性高但硬件昂贵
- 软路由的特点：软件丰富，可玩性高，成本较低

软路由和硬路由不是相互代替的，反而是相辅相成的关系，有条件的家庭可以两者都选购

## 系统安装

> OpenWrt 是一款基于 Linux
> 的开源软路由系统，专为嵌入式设备（如路由器、网关、无线接入点等）设计。它提供丰富的网络功能和插件，支持多种硬件平台，允许用户自定义配置和扩展功能，从而实现灵活、定制化的路由器管理和网络服务。
> OpenWrt 提供了一套完整的路由器操作系统，包括了 Linux 内核、网络管理工具、Web 界面、软件包管理器（opkg）等，用户可以通过 SSH 或
> Web 界面进行配置和管理。OpenWrt 具有强大的路由和网络功能，如防火墙、端口转发、虚拟专网（VPN）、负载均衡、QoS（服务质量）、无线网络管理等，同时还支持大量的第三方软件包，如
> DNS 服务器、VPN 服务器、网络存储（NAS）等，可以根据需要进行安装和配置。

### 下载镜像

| 镜像地址                                                                                   | 特点                                         |
|----------------------------------------------------------------------------------------|--------------------------------------------|
| [OpenWrt官方镜像](https://firmware-selector.openwrt.org)                                   | 优点：最为纯净，稳定性也最好<br/>缺点：默认存储空间只有500M，而且不能扩展  |
| [友善官方镜像](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_R4S#Download_Image_Files) | 优点：较为稳定，自带docker<br/>缺点：系统太过臃肿，自定义性差       |
| 第三方固件，如 [supes.top](https://supes.top/)                                                | 优点：由kiddin9大佬贴心定制，适合大多数用户<br/>缺点：比起官方的稳定性差 |

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

访问地址：`https://192.168.1.1:9443`

创建用户名和密码

#### 运行容器

##### Debian

```shell
docker pull debian
docker run -it --name debian debian /bin/bash
```

### Samba

> Samba 是一组不同功能程序组成的应用集合，它能让 Linux 服务器实现文件服务器、身份授权和认证、名称解析和打印服务等功能。
>
> Samba分为服务端和客户端，本次我们打算将软路由上作为文件共享中心，因此需要在软路由上安装Samba的服务端。客户端的话，因为现代的操作系统默认都支持SMB协议，所以只需要稍加配置即可启用

#### 安装

在 `System` > `Software` 中安装samba的服务端 `samba4-server` ,以及可视化配置页面 `luci-app-samba4`
![openwrt_install_samba.png](/post/openwrt/openwrt_install_samba.png)

#### 添加用户

   ```shell
   #安装'useradd'，目的是为了创建用户
   opkg install shadow-useradd
   
   #新建一个用户,名字叫'samba'
   useradd samba
   
   #为用户samba创建密码，看到'Added user samba.'表示用户成功添加到samba中了
   smbpasswd -a samba
   
   #创建一个文件夹用于samba共享，可以自己随意设置
   mkdir -p /opt/samba
   
   #使用户samba获得文件夹权限
   chown -R samba:samba /opt/samba
   ```

#### 软件配置

1. 进入Samba配置页面： `Services` > `Network Shares`
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

### Aria2

> Linux 平台下知名的下载工具

#### 安装

1. 在 `System` > `Software` 中安装 `aria2`, `luci-app-aria2`, `webui-aria2`
2. 安装后在 System > Services > Aria2可找到

#### 配置
1. 在 Basic Options 中开启Aria服务，并设置下载目录，这里我是下载到samba路径下方便分享
   ![aria_enable.png](/post/openwrt/aria_enable.png)
2. 在 RPC Options 生成RPC令牌
   ![aria2_rpc.png](/post/openwrt/aria2_rpc.png)
3. 返回 Basic Options ，点击上方的“WEBUI-ARIA2”按钮
   1. 设置 > 连接设置中填写aria2服务的ip、端口、rpc密钥
      ![aria2_webui.png](/post/openwrt/aria2_webui.png)
   2. 保存连接配置
   3. 现在可以试试下载一个url文件或者BT种子

### [OpenClash](https://github.com/vernesong/OpenClash)

> 一个可运行在 OpenWrt 上的 Clash 客户端，兼容 Shadowsocks、ShadowsocksR、Vmess、Trojan、Snell 等协议

#### 安装

1. 登录路由器后台，比如 `ssh root@192.168.1.1`
2. 下载安装前依赖：
   ```shell
    #如果是新的nftables
    opkg update
    opkg install coreutils-nohup bash dnsmasq-full curl ca-certificates ipset ip-full libcap libcap-bin ruby ruby-yaml kmod-tun kmod-inet-diag unzip kmod-nft-tproxy luci-compat luci luci-base
   
    #如果是旧的iptables
    opkg update
    opkg install coreutils-nohup bash iptables dnsmasq-full curl ca-certificates ipset ip-full iptables-mod-tproxy iptables-mod-extra libcap libcap-bin ruby ruby-yaml kmod-tun kmod-inet-diag unzip luci-compat luci luci-base
    ```
3. 在[OpenClash Release页面](https://github.com/vernesong/OpenClash/releases)找到最新版本的ipk安装包，复制连接地址
   下载安装包: `wget https://github.com/vernesong/OpenClash/releases/download/v0.45.110-beta/luci-app-openclash_0.45.110-beta_all.ipk -O luci-app-openclash.ipk`
4. 安装OpenClash: `opkg install ./luci-app-openclash.ipk`
5. 在Web页面 > Services > OpenClash中即可找到

#### 配置

1. 下载clash内核
    1. OpenClash > Plugin Setting > Version Update
    2. 找到如图位置，点击即可下载最新版clash内核
       ![openclash_download.png](/post/openwrt/openclash_download.png)
2. 添加clash订阅
    1. OpenClash > Config Subscribe > ADD
       ![openclash_subscribe_add.png](/post/openwrt/openclash_subscribe_add.png)
    2. 在`Subscribe Address`中填写自己的clash订阅地址并点击`COMMIT SETTING`保存
3. 点击OpenClash首页左下角“ENABLE OPENCLASH”即可启动
4. 点击中间的“OPEN PANEL”可以访问clash前端UI面板
   ![openclash_enable.png](/post/openwrt/openclash_enable.png)

### [Cloudreve](https://docs.cloudreve.org/)

> 开源的私有云系统，提供类似谷歌云一样的易用界面，支持文件下载、上传、分享等，同时也支持aria2离线下载

#### 安装

1. 使用terminal登录openwrt后台，比如 `ssh root@192.168.1.1`
2. 在GitHub的[release](https://github.com/cloudreve/Cloudreve/releases)页面找到最新的安装包，使用如下命令进行下载并保存
   ```shell
   wget https://github.com/cloudreve/Cloudreve/releases/download/3.7.1/cloudreve_3.7.1_linux_arm64.tar.gz -O cloudreve_3.7.1_linux_arm64.tar.gz
   ```
3. 解压到`/opt/cloudreve`目录下: `tar -zxvf cloudreve_3.7.1_linux_arm64.tar.gz -C /opt/cloudreve`
4. 赋予执行权限: `chmod +x ./cloudreve`
5. 启动cloudreve: `./cloudreve`，命令行日志中可看到初始的管理员密码，**请务必保存！！！**

##### 开机自启动

1. 新增cloudreve启动文件: `vim /etc/init.d/cloudreve`
2. 填写如下的内容:
    ```shell
    #!/bin/sh /etc/rc.common
   
    START=99
    STOP=01
    USE_PROCD=1

    # 应用名称 
    NAME=cloudreve
    # 应用路径
    PROG=/opt/cloudreve/cloudreve
    
    start_service() {
      procd_open_instance
      procd_set_param command "$PROG"
      # 输出日志到系统log中
      procd_set_param stdout 1
      procd_set_param stderr 1
      procd_close_instance
    }
    ```
3. 启用服务: `/etc/init.d/cloudreve enable`

#### 配置离线下载

1. 浏览器访问`192.168.1.1:5212`，使用admin账号登录
   ![cloudreve_login.png](/post/openwrt/cloudreve_login.png)
2. 登录后点右上角头像 > 管理面板 > 离线下载节点，添加新的主节点
3. 在离线下载部分填写Aria2对应的信息，保存后即可使用离线下载功能
   ![cloudreve_login.png](/post/openwrt/cloudreve_aria2.png)
