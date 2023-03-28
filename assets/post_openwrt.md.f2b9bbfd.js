import{_ as a,b as s,e as l,p as n}from"./chunks/framework.2dd5ae9d.js";const o="/post/openwrt/openwrt_install_samba.png",e="/post/openwrt/shared_directories.png",p="/post/openwrt/macOS_compatible.png",t="/post/openwrt/windows_samba_enable.png",r="/post/openwrt/windows_samba.png",c="/post/openwrt/mac_finder_samba.png",i="/post/openwrt/iOS_samba_connect.png",d="/post/openwrt/iOS_samba_display.png",k=JSON.parse('{"title":"面向小白的软路由入门指南","description":"","frontmatter":{"title":"面向小白的软路由入门指南","date":"2022-04-30T00:00:00.000Z","excerpt":" OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。","tags":["OpenWrt","软路由","OpenClash","Docker","uu加速器","samba","aria"]},"headers":[],"relativePath":"post/openwrt.md","lastUpdated":1680008516000}'),C={name:"post/openwrt.md"},y=n(`<h1 id="面向小白的软路由入门指南" tabindex="-1">面向小白的软路由入门指南 <a class="header-anchor" href="#面向小白的软路由入门指南" aria-label="Permalink to &quot;面向小白的软路由入门指南&quot;">​</a></h1><p>演示的软路由型号为友善R4S</p><h2 id="为什么需要一台软路由" tabindex="-1">为什么需要一台软路由 <a class="header-anchor" href="#为什么需要一台软路由" aria-label="Permalink to &quot;为什么需要一台软路由&quot;">​</a></h2><h2 id="软路由需要安装什么系统" tabindex="-1">软路由需要安装什么系统 <a class="header-anchor" href="#软路由需要安装什么系统" aria-label="Permalink to &quot;软路由需要安装什么系统&quot;">​</a></h2><h2 id="软件安装" tabindex="-1">软件安装 <a class="header-anchor" href="#软件安装" aria-label="Permalink to &quot;软件安装&quot;">​</a></h2><h3 id="docker" tabindex="-1">Docker <a class="header-anchor" href="#docker" aria-label="Permalink to &quot;Docker&quot;">​</a></h3><h4 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h4><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">opkg</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">dockerd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">docker-compose</span></span>
<span class="line"></span></code></pre></div><h4 id="管理页面" tabindex="-1">管理页面 <a class="header-anchor" href="#管理页面" aria-label="Permalink to &quot;管理页面&quot;">​</a></h4><p><strong>需要打开防火墙转发，Luci &gt; 网络 &gt; 防火墙 &gt; 转发：接受</strong></p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#676E95;font-style:italic;">#创建一个卷，来供管理工具存储数据</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">volume</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">create</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portainer_data</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#拉取Docker镜像</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pull</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portainer/portainer-ce:linux-arm64</span></span>
<span class="line"></span>
<span class="line"><span style="color:#676E95;font-style:italic;">#运行Docker容器</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">run</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-d</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">8000</span><span style="color:#C3E88D;">:</span><span style="color:#F78C6C;">8000</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#F78C6C;">9443</span><span style="color:#C3E88D;">:</span><span style="color:#F78C6C;">9443</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--name</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portainer</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--restart=always</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-v</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/var/run/docker.sock:/var/run/docker.sock</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-v</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portainer_data:/data</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">portainer/portainer-ce:linux-arm64</span></span>
<span class="line"></span></code></pre></div><p>访问地址：<code>https://192.168.1.1:9443</code></p><p>创建用户名和密码</p><h4 id="运行debian容器" tabindex="-1">运行Debian容器 <a class="header-anchor" href="#运行debian容器" aria-label="Permalink to &quot;运行Debian容器&quot;">​</a></h4><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">pull</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">debian</span></span>
<span class="line"><span style="color:#FFCB6B;">docker</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">run</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-it</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">--name</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">debian</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">debian</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/bin/bash</span></span>
<span class="line"></span></code></pre></div><h3 id="samba" tabindex="-1">Samba <a class="header-anchor" href="#samba" aria-label="Permalink to &quot;Samba&quot;">​</a></h3><h4 id="介绍" tabindex="-1">介绍 <a class="header-anchor" href="#介绍" aria-label="Permalink to &quot;介绍&quot;">​</a></h4><p>Samba 是一组不同功能程序组成的应用集合，它能让 Linux 服务器实现文件服务器、身份授权和认证、名称解析和打印服务等功能。 Samba分为服务端和客户端，本次我们打算将软路由上作为文件共享中心，因此需要在软路由上安装Samba的服务端。客户端的话，因为现代的操作系统默认都支持SMB协议，所以只需要稍加配置即可启用</p><h4 id="安装samba" tabindex="-1">安装Samba <a class="header-anchor" href="#安装samba" aria-label="Permalink to &quot;安装Samba&quot;">​</a></h4><p>在 <code>System</code> -&gt; <code>Software</code> 中安装samba的服务端 <code>samba4-server</code> ,以及可视化配置页面 <code>luci-app-samba4</code><div><img src="`+o+`" alt="" style="max-height:400px;" loading="lazy"></div></p><h4 id="添加用户" tabindex="-1">添加用户 <a class="header-anchor" href="#添加用户" aria-label="Permalink to &quot;添加用户&quot;">​</a></h4><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#FFCB6B;">opkg</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">install</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">shadow-useradd</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 安装&#39;useradd&#39;，目的是为了创建用户</span></span>
<span class="line"><span style="color:#FFCB6B;">useradd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 新建一个用户,名字叫&#39;samba&#39;</span></span>
<span class="line"><span style="color:#FFCB6B;">smbpasswd</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-a</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">#为用户samba创建密码，看到&#39;Added user samba.&#39;表示用户成功添加到samba中了</span></span>
<span class="line"><span style="color:#FFCB6B;">mkdir</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-p</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/opt/samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;"># 创建一个文件夹用于samba共享，可以自己随意设置</span></span>
<span class="line"><span style="color:#FFCB6B;">chown</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">-R</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">samba:samba</span><span style="color:#A6ACCD;"> </span><span style="color:#C3E88D;">/opt/samba</span><span style="color:#A6ACCD;"> </span><span style="color:#676E95;font-style:italic;">#使用户samba获得文件夹权限</span></span>
<span class="line"></span></code></pre></div><h4 id="软件配置" tabindex="-1">软件配置 <a class="header-anchor" href="#软件配置" aria-label="Permalink to &quot;软件配置&quot;">​</a></h4><ol><li>进入Samba配置页面： <code>Services</code> -&gt; <code>Network Shares</code></li><li>共享目录，注意 <code>Path</code> 一定要选之前创建的，例如我的就是 <code>/opt/samba</code>，其他的可以参照我的截图来 <div><img src="`+e+'" alt="" style="max-height:400px;" loading="lazy"></div></li><li>兼容苹果设备访问(建议打开) <div><img src="'+p+'" alt="" style="max-height:400px;" loading="lazy"></div></li></ol><h4 id="其他平台访问方式" tabindex="-1">其他平台访问方式 <a class="header-anchor" href="#其他平台访问方式" aria-label="Permalink to &quot;其他平台访问方式&quot;">​</a></h4><ol><li>Windows <ol><li>在启用或关闭windows功能中打开 <code>SMB 1.0/CIFS 文件共享支持</code> 和 <code>SMB直通</code><div><img src="'+t+'" alt="" style="max-height:400px;" loading="lazy"></div></li><li>打开文件夹，访问samba服务地址，例如 <code>smb://192.168.1.1</code>，然后回车</li><li>按照提示输入用户名和密码即可成功连接 <div><img src="'+r+'" alt="" style="max-height:400px;" loading="lazy"></div></li></ol></li><li>Mac <ol><li>打开finder</li><li>按下快捷键 <code>⌘</code> + <code>K</code> 打开连接</li><li>输入samba的服务器地址，例如 <code>smb://192.168.1.1</code>，点击连接</li><li>按照提示输入用户名和密码即可成功连接 <div><img src="'+c+'" alt="" style="max-height:400px;" loading="lazy"></div></li></ol></li><li>iPhone/iPad <ol><li>打开文件 -&gt; 浏览，然后点击右上角 更多 -&gt; 连接服务器 <div><img src="'+i+'" alt="" style="max-height:400px;" loading="lazy"></div></li><li>输入samba的服务器地址，例如 <code>smb://192.168.1.1</code>，点击连接</li><li>按照提示输入用户名和密码即可成功连接 <div><img src="'+d+'" alt="" style="max-height:400px;" loading="lazy"></div></li></ol></li></ol>',26),h=[y];function m(A,D,b,u,g,_){return s(),l("div",null,h)}const x=a(C,[["render",m]]);export{k as __pageData,x as default};
