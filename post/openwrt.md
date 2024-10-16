---
layout: 'post'
title: 面向小白的软路由入门指南
date: 2022-04-30
excerpt: "OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。"
tags:
  - OpenWrt
  - 软路由
  - OpenClash
  - Docker
  - 游戏加速器
  - samba
  - aria2
---

> 本文演示的软路由型号为友善R4S，其使用ARM v8芯片，相比传统的X86芯片能耗更低，更适合软路由系统

## 介绍

类似于计算机有软件和硬件的概念，在路由器领域，我们习惯把常用的可以发射Wi-Fi信号的设备称为“硬路由”，而把没有无线功能，但是运行着路由系统的设备称为“软路由”

- 硬路由的特点：无线信号强，稳定性高但硬件昂贵
- 软路由的特点：软件丰富，可玩性高，成本较低

软路由和硬路由不是相互代替的，反而是相辅相成的关系，有条件的家庭可以两者都选购

## 网络拓扑图

> 常见的家庭网络拓扑图，可以看到软路由的位置仅次于光猫，在网络拓扑图中具有较高的地位，正因如此，软路由才可以实现一些硬路由没法实现的高级玩法

![topology.png](/post/openwrt/topology.png)

## 开始之前

> OpenWrt 是一款基于 Linux
> 的开源软路由系统，专为嵌入式设备（如路由器、网关、无线接入点等）设计。它提供丰富的网络功能和插件，支持多种硬件平台，允许用户自定义配置和扩展功能，从而实现灵活、定制化的路由器管理和网络服务。
> OpenWrt 提供了一套完整的路由器操作系统，包括了 Linux 内核、网络管理工具、Web 界面、软件包管理器（opkg）等，用户可以通过 SSH 或
> Web 界面进行配置和管理。OpenWrt 具有强大的路由和网络功能，如防火墙、端口转发、虚拟专网（VPN）、负载均衡、QoS（服务质量）、无线网络管理等，同时还支持大量的第三方软件包，如
> DNS 服务器、VPN 服务器、网络存储（NAS）等，可以根据需要进行安装和配置。

![openwrt_logo.png](/post/openwrt/openwrt_logo.png)

### 下载镜像

| 镜像地址                                                                                   | 特点                                        |
|----------------------------------------------------------------------------------------|-------------------------------------------|
| [OpenWrt官方镜像](https://firmware-selector.openwrt.org)「推荐」                               | 优点：最为纯净，稳定性也最好<br/>缺点：默认存储空间只有500M，而且不能扩展 |
| [友善官方镜像](https://wiki.friendlyelec.com/wiki/index.php/NanoPi_R4S#Download_Image_Files) | 优点：较为稳定，自带docker<br/>缺点：系统太过臃肿，自定义性差      |
| [supes.top](https://supes.top/)                                                        | 优点：由kiddin9大佬贴心定制，适合小白用户<br/>缺点：比起官方的稳定性差 |

当然如果你熟悉linux系统的话，也可以自己下载OpenWrt源代码后来编译生成固件，这就不在本篇文章的范围内了

### 软件安装

> 以下三种方式任选一种即可
>
> luci软件安装后在「Service」菜单中可找到

#### 官方仓库

1. 登录openwrt后台web界面
2. 访问：**System** > **Software** > **Update lists**，更新软件源
3. 在上方的红框中输入软件课程，然后在中意的软件右侧点击「Install」

   ![luci_install.png](/post/openwrt/luci_install.png)

#### 手动上传安装包

ipk文件仓库列表：

| 名称           | 仓库地址                                    |
|--------------|-----------------------------------------|
| openwrt官方仓库  | https://downloads.openwrt.org/releases/ |
| kiddin9大佬的仓库 | https://op.supes.top/packages/          |

1. 下载好需要的`.ipk`安装包文件
2. web页面访问：**System** > **Software** > **Upload Package**，上传`.ipk`安装包

   ![upload_ipk.png](/post/openwrt/upload_ipk.png)

#### 命令行安装

1. 使用ssh连接到openwrt
2. 执行如下的命令
   ```shell
   #更新源
   opkg update
   #搜索安装包
   opkg search {package_name}
   #安装
   opkg install {package_name}
   ```

### 扩容分区

> OpenWrt默认的系统分区只有100M左右，如果你的SD卡空间较大，建议进行扩容
>
> ⚠️以下命令只能在Linux环境下运行

1. 执行下面的命令，对镜像包进行分区扩容
    ```shell
    # 解压下载好的镜像包
    gzip -kdq openwrt-22.03.4-rockchip-armv8-friendlyarm_nanopi-r4s-squashfs-sysupgrade.img.gz
    
    # 重命名文件
    mv openwrt-22.03.4-rockchip-armv8-friendlyarm_nanopi-r4s-squashfs-sysupgrade.img op.img
    
    #扩容8000M，这里因为我的SD卡总容量为32G，分出8G绰绰有余
    dd if=/dev/zero bs=1M count=500 >>op.img
    
    #进入分区工具
    parted op.img
    #查看分区情况
    print
    #扩容分区2
    resizepart 2 100%
    #再次查看
    print
    
    #退出分区工具
    quit
    
    ```
2. 分区之后的数据类似下图

   ![img_partition.png](/post/openwrt/img_partition.png)
3. 使用u盘工具刷入镜像包，如: [Rufus](https://rufus.ie/zh/), [Etcher](https://www.balena.io/etcher)

### 磁盘分区

1. 搜索下载`luci-app-diskman.ipk`

2. 进入 **System** > **Disk Man** > **Edit**,（如页面报错，则需要安装`luci-compat`）

   ![diskman_edit.png](/post/openwrt/diskman_edit.png)

3. 填写分区起始、结束位置（一般默认就行），点击「New」，完成分区新建

   ![diskman_new.png](/post/openwrt/diskman_new.png)

4. 格式化分区为**ext4**格式

5. **System** > **Software**，搜索并下载`block-mount`

6. 进入 **System** > **Mount Points**，找到新建的分区，然后**Edit** > **Enable** > **Save&Apply**

   ![partition_enable.png](/post/openwrt/partition_enable.png)

## 推荐软件

### Argon主题

> OpenWrt下的高颜值主题

#### 安装清单

- `luci-theme-argon`：argon主题

#### 启用

2. **System** > **System** > **Language and Style**，选择Argon主题并保存

   ![argon_enable.png](/post/openwrt/argon_enable.png)

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

##### MariaDB

```shell
docker pull mariadb
docker run --name mariadb -v /my/own/datadir:/var/lib/mysql -e MARIADB_ROOT_PASSWORD=my-secret-pw -d mariadb:latest
```

##### Redis

```shell
docker pull redis
docker run -v /myredis/conf:/usr/local/etc/redis --name myredis redis redis-server /usr/local/etc/redis/redis.conf
```

### Samba

> Samba 是一组不同功能程序组成的应用集合，它能让 Linux 服务器实现文件服务器、身份授权和认证、名称解析和打印服务等功能。
>
> Samba分为服务端和客户端，本次我们打算将软路由上作为文件共享中心，因此需要在软路由上安装Samba的服务端。客户端的话，因为现代的操作系统默认都支持SMB协议，所以只需要稍加配置即可启用

#### 安装

- `samba4-server`：samba的服务端
- `luci-app-samba4`：可视化配置页面

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

1. 进入Samba配置页面： **Services** > **Network Shares**

2. 共享目录，注意 `Path` 一定要选之前创建的，例如我的就是 `/opt/samba`，其他的可以参照我的截图来
  
   ![shared_directories](/post/openwrt/shared_directories.png)
3. 兼容苹果设备访问(建议打开)
   
   ![macOS_compatible](/post/openwrt/macOS_compatible.png)

#### 其他平台访问方式

##### Windows

1. 在启用或关闭windows功能中打开 `SMB 1.0/CIFS 文件共享支持` 和 `SMB直通`
   
   ![windows_samba_enable](/post/openwrt/windows_samba_enable.png)

2. 打开文件资源管理器，右键「此电脑」-> 「映射网络驱动器」
   
   ![windows_add_driver.png](/post/openwrt/windows_add_driver.png)

3. 文件夹填入`\\192.168.1.1\samba`，然后回车

4. 按照提示输入用户名和密码即可成功连接
   
   ![windows_samba.png](/post/openwrt/windows_samba.png)

##### Mac

1. 打开Finder

2. 按下快捷键 `⌘ + k` 打开连接

3. 输入samba的服务器地址，例如 `smb://192.168.1.1`，点击连接

4. 按照提示输入用户名和密码即可成功连接
   
   ![mac_finder_samba](/post/openwrt/mac_finder_samba.png)

##### iPhone/iPad

1. 打开文件 -> 浏览，然后点击右上角 更多 -> 连接服务器
   
   ![iOS_samba_connect.png](/post/openwrt/iOS_samba_connect.png)

2. 输入samba的服务器地址，例如 `smb://192.168.1.1`，点击连接

3. 按照提示输入用户名和密码即可成功连接

   ![iOS_samba_display.png](/post/openwrt/iOS_samba_display.png)

### Aria2

> Linux 平台下知名的下载工具

#### 安装清单

- `aria2`：aria2内核
- `luci-app-aria2`：luci界面
- `webui-aria2`：web界面

#### 配置

1. 在 **Basic Options** 中开启Aria服务，并设置下载目录，这里我是下载到samba路径下方便分享
   
   ![aria_enable.png](/post/openwrt/aria_enable.png)

2. 在 RPC Options 生成RPC令牌
   
   ![aria2_rpc.png](/post/openwrt/aria2_rpc.png)

3. 返回 Basic Options ，点击上方的“WEBUI-ARIA2”按钮

    1. 设置 > 连接设置中填写aria2服务的ip、端口、rpc密钥
   
       ![aria2_webui.png](/post/openwrt/aria2_webui.png)
    2. 保存连接配置
    3. 现在可以试试下载一个url文件或者BT种子

### 网络唤醒

> 教你如何使用Siri唤醒你的PC电脑

#### 安装清单

- `luci-app-wol` (会自动安装`etherwake`等依赖)

#### PC设置

1. 在 Windows 10 中，运行 > ncpa.cpl 打开「网络连接」设置，然后找到当前在使用的有线网卡，右键点击「属性」：
   
   ![pc_etherwake.png](/post/openwrt/pc_etherwake.png)

2. 然后选择「配置」：
   
   ![pc_etherwake2.png](/post/openwrt/pc_etherwake2.png)

3. 在随后弹出的面板中找到「电源管理」，勾选「允许此设备唤醒计算机」以及「只允许幻数据包唤醒计算机」
   
   ![pc_etherwake3.png](/post/openwrt/pc_etherwake3.png)

#### 主板设置

除此之外，我们可能还需要启用适当的 BIOS 设置才能使用 WoL 功能，具体方法视厂商而定，进入 BIOS 后注意选项附加的说明即可，可以参考的关键词包括：

- Network Stack
- Automatic Power On
- Wake on LAN/WLAN
- Power Management
- Power On by Onboard LAN
- Power On by PCI-E Devices

#### 测试唤醒

1. **Service** > **Wake On LAN**

2. 选择网口和待唤醒的主机IP，点击「WAKE UP HOST」

#### iOS

1. **捷径** > **新建快捷指令** > **添加操作**，选择「通过SSH运行脚本」

2. 填写脚本代码: `etherwake -D ${需要唤醒的MAC地址}`

3. 填写ssh连接信息
   
   ![wakeup_shortcut.png](/post/openwrt/wakeup_shortcut.png)

4. 之后需要唤醒电脑时：「嘿Siri，唤醒电脑」

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

5. 在 **Services** > **OpenClash** 中即可找到

#### 配置

1. 下载clash内核
    1. **OpenClash** > **Plugin Setting** > **Version Update**
    2. 找到如图位置，点击即可下载最新版clash内核
       
       ![openclash_download.png](/post/openwrt/openclash_download.png)
2. 添加clash订阅
    1. **OpenClash** > **Config Subscribe** > **ADD**
       
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

2. 登录后点右上角**头像** > **管理面板** > **离线下载节点**，修改主节点

3. 在离线下载部分填写Aria2对应的信息，保存后即可使用离线下载功能
   
   ![cloudreve_login.png](/post/openwrt/cloudreve_aria2.png)

### 网易UU加速器

#### 安装清单

- `uugamebooster`：网易uu加速器
- `luci-app-uugamebooster`：对应的luci界面

#### 启用

1. 勾选「enable」，保存并应用
   
   ![uugamebooster.png](/post/openwrt/uugamebooster.png)

2. 然后使用手机APP即可进行加速

其他加速器如：灵缇加速器、迅游加速器等等，步骤都是类似的

## 参考文章

- [彧繎博客](https://opclash.com/luyou/16.html)
- [OpenClash-使用手册](https://github.com/vernesong/OpenClash/wiki)
- [嘿 Siri，唤醒电脑](https://sspai.com/post/67037)
