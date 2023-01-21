---
title: 关于Android刷机相关的，看这篇文章就够了
date: 2022-05-01
excerpt: "关于Android刷机相关的，看这篇文章就够了"
tags:

- Android
- 技术

---

# 关于Android刷机相关的，看这篇文章就够了
参考：https://wiki.lineageos.org/devices/enchilada/install
> 本文以OnePlus 6作为演示机型

## 什么是刷机

## 环境准备

开启USB调试

1. 设置 – 关于手机 – 连击版本号，直到看到提示"您现在处于开发者模式中!"
2. 设置 – 系统 – 开发者选项 – 开启OEM解锁

### adb [🔗](https://developer.android.com/studio/releases/platform-tools)

#### mac安装

### 解锁Bootloader

1. 设置 – 系统 – 开发者选项 – 开启OEM解锁
2. 重新到fastboot模式，命令`adb reboot bootloader`
3. 解锁命令`fastboot flashing unlock`
4. 手机选择"UNLOCK THE BOOTLOADER"(音量键选择，电源键确定)
5. 解锁完成，等待开机（第一次开机会有点慢）

解锁后有什么问题？

1. 每次开启都会提示当前"设备以解锁"
2. 一些软件会检测设备的bootloader锁，可能导致银行、游戏类的软件无法使用

我可以解锁后重新上锁吗？
可以的，不过上锁之前要重新刷回官方的ROM，不然上锁回失败的

## Recovery

### TWRP [🔗](https://twrp.me/Devices/)

一加6国行推荐[美国版本](https://dl.twrp.me/enchilada/)，其他版本可能会导致格式化data分区失败

在fastboot模式下执行命令临时启动下载的TWRP镜像：`fastboot boot twrp-{文件后缀}.img`
永久化TWRP，进入 Advanced > Flash Current TWRP

格式化Data分区失败？
尝试"挂载 - 取消勾选Data分区"，然后重新格式化
## 安装ROM

### LineageOS [🔗](https://download.lineageos.org/enchilada)

### XDA论坛

## 升级固件版本 [🔗](https://wiki.lineageos.org/devices/enchilada/fw_update)

## OPEN GAPPS

## Magisk

https://magiskmanager.com/#How_to_Uninstall_Magisk