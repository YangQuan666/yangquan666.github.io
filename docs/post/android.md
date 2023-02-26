---
title: 关于Android刷机相关的，看这篇文章就够了
date: 2022-05-01
excerpt: "关于Android刷机相关的，看这篇文章就够了"
tags:

- Android
- 技术

---

# 关于Android刷机相关的，看这篇文章就够了

> 本文以OnePlus 6作为演示机型，使用的操作系统是MacOS

## 什么是刷机

刷机是指对手机的操作系统进行修改或升级，以改变手机的功能或性能。手机刷机就类似于电脑的重装系统。
早期由于国内的手机厂商系统会存在很多BUG，导致安卓的体验很不好，如死机、反应慢、音量小等，通过刷机就可以解决这些问题，同时还可以获得一些增强功能，如数码变焦、图像编辑、主题切换等

### 刷机有什么坏处？

- 可能会导致手机的硬件损坏，如电池、屏幕、内存等，从而减少手机的使用寿命。
- 可能会丢失手机中的重要数据，如照片、联系人、短信等，所以在刷机前要备份好数据。
- 可能会失去手机的保修权利或者违反运营商的规定，造成一些法律风险。

## 环境准备

### 开启USB调试

1. 设置 – 关于手机 – 连击版本号，直到看到提示"您现在处于开发者模式中!"
2. 设置 – 系统 – 开发者选项 – 开启OEM解锁

### 安装ADB [🔗](https://developer.android.com/studio/releases/platform-tools)

> ADB是Android Debug Bridge的缩写，是一种可以让你通过电脑对安卓设备进行操作的命令行工具

## 解锁Bootloader

> Bootloader锁是一种限制用户对手机系统进行修改的机制，它会在操作系统内核运行之前检验系统的签名，如果不一致就终止启动。
> 安卓手机出厂都会有Bootloader锁，它可以保护手机的系统安全。如果用户想要刷入第三方ROM或者获取root权限，就需要先解锁Bootloader锁。
> 解锁Bootloader锁的方法不同于手机型号和厂商，一般需要通过专用命令行工具来进行。

1. 设置 – 系统 – 开发者选项 – 开启OEM解锁
2. 重新到fastboot模式，命令`adb reboot bootloader`
3. 解锁命令`fastboot flashing unlock`
4. 手机选择"UNLOCK THE BOOTLOADER"(音量键选择，电源键确定)
5. 解锁完成，等待开机（第一次开机会有点慢）

### 解锁后有什么问题？

1. 每次开启都会提示"当前设备已解锁"
2. 一些软件(银行app或者反作弊游戏)会检测设备的bootloader锁，可能导致该类软件无法正常运行

### 我可以解锁后重新上锁吗？

可以的，不过上锁之前要重新刷回官方的ROM，不然上锁会失败的

## 刷第三方Recovery

>

### 刷入TWRP [🔗](https://twrp.me/Devices/)

> 一加6国行推荐[美国版本](https://dl.twrp.me/enchilada/)，其他版本可能会导致格式化data分区失败

临时启动TWRP：`fastboot boot twrp-{文件后缀}.img`

永久化TWRP：`Advanced > Flash Current TWRP`

#### 格式化Data分区失败？

尝试`挂载 - 取消勾选Data分区`，然后重新格式化

## 安装ROM

> 安装ROM通常分为卡刷和线刷两种，卡刷就是先把ROM拷贝到手机SD卡，然后通过Recovery刷入；线刷是通过命令，直接将电脑上的ROM刷入手机，本文以线刷为例

1. 下载 [LineageOS ROM](https://download.lineageos.org/enchilada)
2. 将下载好的`.zip`文件放入手机根目录：
   1. 在手机端进入：`TWRP - Advanced - ADB Sideload`
   2. 在电脑端执行：`adb sideload {lineageos刷机包}.zip`
3. 安装完之后，如果你不需要安装后续的附加组件，则可以选择重启进入系统

至此刷机的必要操作就完成了，你可以尽情的享受LineageOS系统的流畅丝滑体验😎

## 附加组件

> 如果您不想安装任何附加组件，您可以跳过整个部分！

### GAPPS

> 警告：如果您安装GAPPS，必须在首次启动到LineageOS之前按照以下步骤操作！
>
> 如果你想使用谷歌商店，或者你想使用谷歌的应用入YouTube等，则必须安装谷歌套件GAPPS，缺少谷歌套件会导致一些国外应用、游戏无法使用

你可以选择下载[LineageOS提供的GAPPS](https://wiki.lineageos.org/gapps)，也可以选择使用[Open GApps提供的GAPPS](https://opengapps.org)

1. 安装完ROM之后不要重启系统
2. 继续使用线刷的方式刷入GAPPS：`adb sideload {GAPPS安装包}.zip`

### Magisk

> 面具是一款非常强大的框架，能让你获取root权限，也可以通过安装各种模块来修改系统的功能，你的安装体验更上一层楼

1. 下载 Magisk APK 文件，[GitHub地址](https://github.com/topjohnwu/Magisk/releases)
2. 将`.apk`文件重命名为`.zip`，例如: Magisk-v24.0.apk → Magisk-v24.0.zip
3. 使用同样方式刷入即可

## 参考

- [OnePlus 官方 ROM](https://www.oneplus.com/cn/support/softwareupgrade)
- [OnePlus6 固件升级教程](https://wiki.lineageos.org/devices/enchilada/fw_update)
- [OnePlus6 安装 LineageOS教程](https://wiki.lineageos.org/devices/enchilada/install)
- [OnePlus6 LineageOS ROM 下载 ](https://download.lineageos.org/enchilada)
- [OnePlus6 XDA 论坛](https://forum.xda-developers.com/c/oneplus-6.7609/)
- [Magisk 文档](https://topjohnwu.github.io/Magisk/install.html#magisk-in-recovery)