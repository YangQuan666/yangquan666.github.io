import{_ as a,c as s,o as e,d as n}from"./app.43f98486.js";const o="/post/openwrt/openwrt_install_samba.png",l="/post/openwrt/shared_directories.png",t="/post/openwrt/macOS_compatible.png",i="/post/openwrt/windows_samba_enable.png",p="/post/openwrt/windows_samba.png",r="/post/openwrt/mac_finder_samba.png",c="/post/openwrt/iOS_samba_connect.png",d="/post/openwrt/iOS_samba_display.png",S=JSON.parse('{"title":"面向小白的软路由入门指南","description":"","frontmatter":{"title":"面向小白的软路由入门指南","date":"2022-04-30T05:30:00.000Z","excerpt":" OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。","tags":["OpenWrt","软路由","OpenClash","Docker","uu加速器","samba","aria"]},"headers":[{"level":2,"title":"为什么需要一台软路由","slug":"为什么需要一台软路由","link":"#为什么需要一台软路由","children":[]},{"level":2,"title":"软路由需要安装什么系统","slug":"软路由需要安装什么系统","link":"#软路由需要安装什么系统","children":[]},{"level":2,"title":"软件安装","slug":"软件安装","link":"#软件安装","children":[{"level":3,"title":"Samba","slug":"samba","link":"#samba","children":[]}]}],"relativePath":"post/openwrt.md"}'),m={name:"post/openwrt.md"},h=n('<h1 id="面向小白的软路由入门指南" tabindex="-1">面向小白的软路由入门指南 <a class="header-anchor" href="#面向小白的软路由入门指南" aria-hidden="true">#</a></h1><p>演示的软路由型号为友善R4S</p><h2 id="为什么需要一台软路由" tabindex="-1">为什么需要一台软路由 <a class="header-anchor" href="#为什么需要一台软路由" aria-hidden="true">#</a></h2><h2 id="软路由需要安装什么系统" tabindex="-1">软路由需要安装什么系统 <a class="header-anchor" href="#软路由需要安装什么系统" aria-hidden="true">#</a></h2><h2 id="软件安装" tabindex="-1">软件安装 <a class="header-anchor" href="#软件安装" aria-hidden="true">#</a></h2><h3 id="samba" tabindex="-1">Samba <a class="header-anchor" href="#samba" aria-hidden="true">#</a></h3><h4 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-hidden="true">#</a></h4><p>Samba 是一组不同功能程序组成的应用集合，它能让 Linux 服务器实现文件服务器、身份授权和认证、名称解析和打印服务等功能。 Samba分为服务端和客户端，本次我们打算将软路由上作为文件共享中心，因此需要在软路由上安装Samba的服务端。客户端的话，因为现代的操作系统默认都支持SMB协议，所以只需要稍加配置即可启用</p><h4 id="安装samba" tabindex="-1">安装Samba <a class="header-anchor" href="#安装samba" aria-hidden="true">#</a></h4><p>在 <code>System</code> -&gt; <code>Software</code> 中安装samba的服务端 <code>samba4-server</code> ,以及可视化配置页面 <code>luci-app-samba4</code><img src="'+o+`" alt="openwrt_install_samba.png"></p><h4 id="添加用户" tabindex="-1">添加用户 <a class="header-anchor" href="#添加用户" aria-hidden="true">#</a></h4><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-palenight"><code><span class="line"><span style="color:#FFCB6B;">opkg</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">shadow-useradd</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 安装&#39;useradd&#39;，目的是为了创建用户</span></span>
<span class="line"><span style="color:#FFCB6B;">useradd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 新建一个用户,名字叫&#39;samba&#39;</span></span>
<span class="line"><span style="color:#FFCB6B;">smbpasswd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-a</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">#为用户samba创建密码，看到&#39;Added user samba.&#39;表示用户成功添加到samba中了</span></span>
<span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/opt/samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 创建一个文件夹用于samba共享，可以自己随意设置</span></span>
<span class="line"><span style="color:#FFCB6B;">chown</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-R</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba:samba</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/opt/samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">#使用户samba获得文件夹权限</span></span>
<span class="line"></span></code></pre></div><h4 id="软件配置" tabindex="-1">软件配置 <a class="header-anchor" href="#软件配置" aria-hidden="true">#</a></h4><ol><li>进入Samba配置页面： <code>Services</code> -&gt; <code>Network Shares</code></li><li>共享目录，注意 <code>Path</code> 一定要选之前创建的，例如我的就是 <code>/opt/samba</code>，其他的可以参照我的截图来 <img src="`+l+'" alt="shared_directories"></li><li>兼容苹果设备访问(建议打开) <img src="'+t+'" alt="macOS_compatible"></li></ol><h4 id="其他平台访问方式" tabindex="-1">其他平台访问方式 <a class="header-anchor" href="#其他平台访问方式" aria-hidden="true">#</a></h4><ol><li>Windows <ol><li>在启用或关闭windows功能中打开 <code>SMB 1.0/CIFS 文件共享支持</code> 和 <code>SMB直通</code><img src="'+i+'" alt="windows_samba_enable"></li><li>打开文件夹，访问samba服务地址，例如 <code>smb://192.168.1.1</code>，然后回车</li><li>按照提示输入用户名和密码即可成功连接 <img src="'+p+'" alt="windows_samba.png"></li></ol></li><li>Mac <ol><li>打开finder</li><li>按下快捷键 <code>⌘</code> + <code>k</code> 打开连接</li><li>输入samba的服务器地址，例如 <code>smb://192.168.1.1</code>，点击连接</li><li>按照提示输入用户名和密码即可成功连接 <img src="'+r+'" alt="mac_finder_samba"></li></ol></li><li>iPhone/iPad <ol><li>打开文件 -&gt; 浏览，然后点击右上角 更多 -&gt; 连接服务器 <img src="'+c+'" alt="iOS_samba_connect.png"></li><li>输入samba的服务器地址，例如 <code>smb://192.168.1.1</code>，点击连接</li><li>按照提示输入用户名和密码即可成功连接 <img src="'+d+'" alt="iOS_samba_display.png"></li></ol></li></ol>',16),_=[h];function b(C,y,g,A,u,w){return e(),s("div",null,_)}const f=a(m,[["render",b]]);export{S as __pageData,f as default};
