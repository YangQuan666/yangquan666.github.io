---
title: 面向小白的一篇OpenWRT入门教程
date: 2022-04-30T13:30:00+08:00
excerpt: "OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。"
tags:
- OpenWrt
- 软路由
- 翻墙
- openClash
- uu加速器
---
# 华硕RT-AX56U V2路由器安装clash

1. 参考项目：[iloahz/asus-router-stock-firmware-clash](https://github.com/iloahz/asus-router-stock-firmware-clash)

2. clash地址（armv7）：[Dreamacro/clash: A rule-based tunnel in Go. (github.com)](https://github.com/Dreamacro/clash)

3. web界面：[haishanh/yacd: Yet Another Clash Dashboard (github.com)](https://github.com/haishanh/yacd)

## 开启SSH

1. 登录路由器后台 > 系统管理 > 系统设置

2. ssh命令登录路由器：`ssh {username}@192.168.50.1`

## 配置启动和关闭脚本

1. start.sh
   
   ```shell
   #!/bin/sh
   
   create_iptables_rules() {
       if ! /usr/sbin/iptables -L -n -t nat | grep -lq CLASH; then
           /usr/sbin/iptables -t nat -A PREROUTING -p tcp --dport 22 -j ACCEPT
           /usr/sbin/iptables -t nat -N CLASH
           /usr/sbin/iptables -t nat -A CLASH -p tcp --dport 7890 -j RETURN
           /usr/sbin/iptables -t nat -A CLASH -d 192.168.0.0/16 -j RETURN
           /usr/sbin/iptables -t nat -A CLASH -p tcp -j REDIRECT --to-ports 7892
           /usr/sbin/iptables -t nat -A PREROUTING -j CLASH
           /usr/sbin/iptables -t nat -A PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053
       fi
   }
   
   clashdir=/jffs/clash
   start_clash() {
       killall clash
       nohup $clashdir/clash -d $clashdir -f $clashdir/config.yaml > nohup.out 2>&1 &
   }
   
   create_iptables_rules
   start_clash
   ```

2. stop.sh
   
   ```shell
   #!/bin/sh
   
   clear_iptables_rules() {
     if /usr/sbin/iptables -L -n -t nat | grep -lq CLASH; then
       /usr/sbin/iptables -t nat -D PREROUTING -p tcp --dport 22 -j ACCEPT
       /usr/sbin/iptables -t nat -D PREROUTING -j CLASH
       /usr/sbin/iptables -t nat -F CLASH
       /usr/sbin/iptables -t nat -X CLASH
       /usr/sbin/iptables -t nat -D PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053
     fi
   }
   
   stop_clash() {
     killall clash
   }
   
   clear_iptables_rules
   stop_clash
   ```

## 访问控制界面

1. 执行`sh start.sh`

2. 访问[192.168.50.1:9090 - yacd](http://192.168.50.1:9090/ui/#/proxies)