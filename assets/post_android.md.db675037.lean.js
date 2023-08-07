import{_ as a,v as e,c as o,R as r}from"./chunks/framework.2325a593.js";const t="/post/android/fastboot.png",l="/post/android/oem-lock.jpg",i="/post/android/magisk.png",q=JSON.parse('{"title":"关于Android刷机相关的，看这篇文章就够了","description":"","frontmatter":{"title":"关于Android刷机相关的，看这篇文章就够了","date":"2022-05-01T00:00:00.000Z","excerpt":"本文探讨了Android刷机的基本概念和步骤，包括解锁引导程序、刷入自定义固件和恢复原厂系统等操作。通过详细的指导和注意事项，读者将了解如何安全地刷机、定制系统和解锁更多功能","tags":["Android","技术"]},"headers":[],"relativePath":"post/android.md","filePath":"post/android.md","lastUpdated":1691420846000}'),d={name:"post/android.md"},n=r('<h1 id="关于android刷机相关的-看这篇文章就够了" tabindex="-1">关于Android刷机相关的，看这篇文章就够了 <a class="header-anchor" href="#关于android刷机相关的-看这篇文章就够了" aria-label="Permalink to &quot;关于Android刷机相关的，看这篇文章就够了&quot;">​</a></h1><blockquote><p>本文以OnePlus 6作为演示机型，刷入的ROM包为LineageOS，操作环境为MacOS</p></blockquote><p><img src="'+t+'" style="max-height:400px;" loading="lazy"></p><h2 id="什么是刷机" tabindex="-1">什么是刷机 <a class="header-anchor" href="#什么是刷机" aria-label="Permalink to &quot;什么是刷机&quot;">​</a></h2><p>刷机是指对手机的操作系统进行修改或升级，以改变手机的功能或性能。手机刷机就类似于电脑的重装系统。 早期由于国内的手机厂商系统会存在很多BUG，导致安卓的体验很不好，如死机、反应慢、音量小等，通过刷机就可以解决这些问题，同时还可以获得一些增强功能，如数码变焦、图像编辑、主题切换等</p><h3 id="刷机的风险" tabindex="-1">刷机的风险 <a class="header-anchor" href="#刷机的风险" aria-label="Permalink to &quot;刷机的风险&quot;">​</a></h3><ul><li>可能会导致手机的硬件损坏，如电池、屏幕、内存等，从而减少手机的使用寿命。</li><li>可能会丢失手机中的重要数据，如照片、联系人、短信等，所以在刷机前要备份好数据。</li><li>可能会失去手机的保修权利或者违反运营商的规定，造成一些法律风险。</li></ul><h2 id="环境准备" tabindex="-1">环境准备 <a class="header-anchor" href="#环境准备" aria-label="Permalink to &quot;环境准备&quot;">​</a></h2><h3 id="开启usb调试" tabindex="-1">开启USB调试 <a class="header-anchor" href="#开启usb调试" aria-label="Permalink to &quot;开启USB调试&quot;">​</a></h3><ol><li>设置 &gt; 关于手机 &gt; 连击版本号，直到看到提示「您现在处于开发者模式中！」</li><li>设置 &gt; 系统 &gt; 开发者选项 &gt; 开启OEM解锁</li></ol><h3 id="安装adb-🔗" tabindex="-1">安装ADB <a href="https://developer.android.com/studio/releases/platform-tools" target="_blank" rel="noreferrer">🔗</a> <a class="header-anchor" href="#安装adb-🔗" aria-label="Permalink to &quot;安装ADB [🔗](https://developer.android.com/studio/releases/platform-tools)&quot;">​</a></h3><blockquote><p>ADB是Android Debug Bridge的缩写，是一种可以让你通过电脑对安卓设备进行操作的命令行工具</p></blockquote><h2 id="解锁bootloader" tabindex="-1">解锁Bootloader <a class="header-anchor" href="#解锁bootloader" aria-label="Permalink to &quot;解锁Bootloader&quot;">​</a></h2><blockquote><p>Bootloader锁是一种限制用户对手机系统进行修改的机制，它会在操作系统内核运行之前检验系统的签名，如果不一致就终止启动。 安卓手机出厂都会有Bootloader锁，它可以保护手机的系统安全。如果用户想要刷入第三方ROM或者获取root权限，就需要先解锁Bootloader锁。 解锁Bootloader锁的方法不同于手机型号和厂商，一般需要通过专用命令行工具来进行。</p></blockquote><ol><li><p>设置 &gt; 系统 &gt; 开发者选项 &gt; 开启OEM解锁</p></li><li><p>重新到fastboot模式，命令<code>adb reboot bootloader</code></p></li><li><p>解锁命令<code>fastboot flashing unlock</code></p></li><li><p>手机选择&quot;UNLOCK THE BOOTLOADER&quot;(音量键选择，电源键确定)</p><p><img src="'+l+'" style="max-height:400px;" loading="lazy"></p></li><li><p>解锁完成，等待开机（第一次开机会有点慢）</p></li></ol><h3 id="解锁后有什么问题" tabindex="-1">解锁后有什么问题？ <a class="header-anchor" href="#解锁后有什么问题" aria-label="Permalink to &quot;解锁后有什么问题？&quot;">​</a></h3><ol><li>每次开启都会提示&quot;当前设备已解锁&quot;</li><li>一些软件(银行app或者反作弊游戏)会检测设备的bootloader锁，可能导致该类软件无法正常运行</li></ol><h3 id="我可以解锁后重新上锁吗" tabindex="-1">我可以解锁后重新上锁吗？ <a class="header-anchor" href="#我可以解锁后重新上锁吗" aria-label="Permalink to &quot;我可以解锁后重新上锁吗？&quot;">​</a></h3><p>可以的，不过上锁之前要重新刷回官方的ROM，不然上锁会失败的</p><h2 id="刷第三方recovery" tabindex="-1">刷第三方Recovery <a class="header-anchor" href="#刷第三方recovery" aria-label="Permalink to &quot;刷第三方Recovery&quot;">​</a></h2><blockquote></blockquote><h3 id="刷入twrp-🔗" tabindex="-1">刷入TWRP <a href="https://twrp.me/Devices/" target="_blank" rel="noreferrer">🔗</a> <a class="header-anchor" href="#刷入twrp-🔗" aria-label="Permalink to &quot;刷入TWRP [🔗](https://twrp.me/Devices/)&quot;">​</a></h3><blockquote><p>一加6国行推荐<a href="https://dl.twrp.me/enchilada/" target="_blank" rel="noreferrer">美国版本</a>，其他版本可能会导致格式化data分区失败</p></blockquote><p>临时启动TWRP：<code>fastboot boot twrp-{文件后缀}.img</code></p><p>永久化TWRP：「<strong>Advanced</strong>」 &gt; 「<strong>Flash Current TWRP</strong>」</p><h4 id="格式化data分区失败" tabindex="-1">格式化Data分区失败？ <a class="header-anchor" href="#格式化data分区失败" aria-label="Permalink to &quot;格式化Data分区失败？&quot;">​</a></h4><p>尝试「<strong>挂载</strong> &gt; <strong>取消勾选Data分区</strong>」，然后重新格式化</p><h2 id="安装rom" tabindex="-1">安装ROM <a class="header-anchor" href="#安装rom" aria-label="Permalink to &quot;安装ROM&quot;">​</a></h2><blockquote><p>安装ROM通常分为卡刷和线刷两种，卡刷就是先把ROM拷贝到手机SD卡，然后通过Recovery刷入；线刷是通过命令，直接将电脑上的ROM刷入手机，本文以线刷为例</p></blockquote><ol><li>下载 <a href="https://download.lineageos.org/enchilada" target="_blank" rel="noreferrer">LineageOS ROM</a></li><li>将下载好的<code>.zip</code>文件放入手机根目录： <ol><li>在手机端进入：<code>TWRP - Advanced - ADB Sideload</code></li><li>在电脑端执行：<code>adb sideload {lineageos刷机包}.zip</code></li></ol></li><li>安装完之后，如果你不需要安装后续的附加组件，则可以选择重启进入系统</li></ol><p>至此刷机的必要操作就完成了，你可以尽情的享受LineageOS系统的流畅丝滑体验😎</p><h2 id="附加组件" tabindex="-1">附加组件 <a class="header-anchor" href="#附加组件" aria-label="Permalink to &quot;附加组件&quot;">​</a></h2><blockquote><p>如果您不想安装任何附加组件，您可以跳过整个部分！</p></blockquote><h3 id="gapps" tabindex="-1">GAPPS <a class="header-anchor" href="#gapps" aria-label="Permalink to &quot;GAPPS&quot;">​</a></h3><blockquote><p>警告：如果您安装GAPPS，必须在首次启动到LineageOS之前按照以下步骤操作！</p><p>如果你想使用谷歌商店，或者你想使用谷歌的应用入YouTube等，则必须安装谷歌套件GAPPS，缺少谷歌套件会导致一些国外应用、游戏无法使用</p></blockquote><p>你可以选择下载<a href="https://wiki.lineageos.org/gapps" target="_blank" rel="noreferrer">LineageOS提供的GAPPS</a> ，也可以选择使用<a href="https://opengapps.org" target="_blank" rel="noreferrer">Open GApps提供的GAPPS</a></p><ol><li>安装完ROM之后不要重启系统</li><li>继续使用线刷的方式刷入GAPPS：<code>adb sideload {GAPPS安装包}.zip</code></li></ol><h3 id="magisk" tabindex="-1">Magisk <a class="header-anchor" href="#magisk" aria-label="Permalink to &quot;Magisk&quot;">​</a></h3><p><img src="'+i+'" style="max-height:400px;" loading="lazy"></p><blockquote><p>面具是一款非常强大的框架，能让你获取root权限，也可以通过安装各种模块来修改系统的功能，你的安装体验更上一层楼</p></blockquote><ol><li>下载 Magisk APK 文件，<a href="https://github.com/topjohnwu/Magisk/releases" target="_blank" rel="noreferrer">GitHub地址</a></li><li>将<code>.apk</code>文件重命名为<code>.zip</code>，例如: Magisk-v24.0.apk → Magisk-v24.0.zip</li><li>使用同样方式刷入即可</li></ol><h2 id="参考" tabindex="-1">参考 <a class="header-anchor" href="#参考" aria-label="Permalink to &quot;参考&quot;">​</a></h2><ul><li><a href="https://www.oneplus.com/cn/support/softwareupgrade" target="_blank" rel="noreferrer">OnePlus 官方 ROM</a></li><li><a href="https://wiki.lineageos.org/devices/enchilada/fw_update" target="_blank" rel="noreferrer">OnePlus6 固件升级教程</a></li><li><a href="https://wiki.lineageos.org/devices/enchilada/install" target="_blank" rel="noreferrer">OnePlus6 安装 LineageOS教程</a></li><li><a href="https://download.lineageos.org/enchilada" target="_blank" rel="noreferrer">OnePlus6 LineageOS ROM 下载 </a></li><li><a href="https://forum.xda-developers.com/c/oneplus-6.7609/" target="_blank" rel="noreferrer">OnePlus6 XDA 论坛</a></li><li><a href="https://topjohnwu.github.io/Magisk/install.html#magisk-in-recovery" target="_blank" rel="noreferrer">Magisk 文档</a></li></ul>',43),s=[n];function h(p,c,u,b,g,k){return e(),o("div",null,s)}const m=a(d,[["render",h]]);export{q as __pageData,m as default};
