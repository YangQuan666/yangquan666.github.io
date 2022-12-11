import{_ as s,c as a,o as n,a as l}from"./app.59c2f77f.js";const y=JSON.parse('{"title":"华硕RT-AX56U V2路由器安装clash","description":"","frontmatter":{"title":"华硕RT-AX56U V2路由器安装clash","date":"2022-04-30T05:30:00.000Z","excerpt":"暂时用作个人的知识收藏","tags":["ASUS","路由器","clash"]},"headers":[{"level":2,"title":"开启SSH","slug":"开启ssh","link":"#开启ssh","children":[]},{"level":2,"title":"配置启动和关闭脚本","slug":"配置启动和关闭脚本","link":"#配置启动和关闭脚本","children":[]},{"level":2,"title":"访问控制界面","slug":"访问控制界面","link":"#访问控制界面","children":[]}],"relativePath":"post/asus-clash.md"}'),p={name:"post/asus-clash.md"},e=l(`<h1 id="华硕rt-ax56u-v2路由器安装clash" tabindex="-1">华硕RT-AX56U V2路由器安装clash <a class="header-anchor" href="#华硕rt-ax56u-v2路由器安装clash" aria-hidden="true">#</a></h1><ol><li><p>参考项目：<a href="https://github.com/iloahz/asus-router-stock-firmware-clash" target="_blank" rel="noreferrer">iloahz/asus-router-stock-firmware-clash</a></p></li><li><p>clash地址（armv7）：<a href="https://github.com/Dreamacro/clash" target="_blank" rel="noreferrer">Dreamacro/clash: A rule-based tunnel in Go. (github.com)</a></p></li><li><p>web界面：<a href="https://github.com/haishanh/yacd" target="_blank" rel="noreferrer">haishanh/yacd: Yet Another Clash Dashboard (github.com)</a></p></li></ol><h2 id="开启ssh" tabindex="-1">开启SSH <a class="header-anchor" href="#开启ssh" aria-hidden="true">#</a></h2><ol><li><p>登录路由器后台 &gt; 系统管理 &gt; 系统设置</p></li><li><p>ssh命令登录路由器：<code>ssh {username}@192.168.50.1</code></p></li></ol><h2 id="配置启动和关闭脚本" tabindex="-1">配置启动和关闭脚本 <a class="header-anchor" href="#配置启动和关闭脚本" aria-hidden="true">#</a></h2><ol><li><p><a href="http://start.sh" target="_blank" rel="noreferrer">start.sh</a></p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">#!/bin/sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">create_iptables_rules</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">!</span><span style="color:#A6ACCD;"> /usr/sbin/iptables -L -n -t nat </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> grep -lq CLASH</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">then</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A PREROUTING -p tcp --dport 22 -j ACCEPT</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -N CLASH</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A CLASH -p tcp --dport 7890 -j RETURN</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A CLASH -d 192.168.0.0/16 -j RETURN</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A CLASH -p tcp -j REDIRECT --to-ports 7892</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A PREROUTING -j CLASH</span></span>
<span class="line"><span style="color:#A6ACCD;">        /usr/sbin/iptables -t nat -A PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053</span></span>
<span class="line"><span style="color:#A6ACCD;">    </span><span style="color:#89DDFF;">fi</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">clashdir=/jffs/clash</span></span>
<span class="line"><span style="color:#82AAFF;">start_clash</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">    killall clash</span></span>
<span class="line"><span style="color:#A6ACCD;">    nohup </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">clashdir/clash -d </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">clashdir -f </span><span style="color:#89DDFF;">$</span><span style="color:#A6ACCD;">clashdir/config.yaml </span><span style="color:#89DDFF;">&gt;</span><span style="color:#A6ACCD;"> nohup.out </span><span style="color:#89DDFF;">2&gt;&amp;1</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">&amp;</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">create_iptables_rules</span></span>
<span class="line"><span style="color:#A6ACCD;">start_clash</span></span>
<span class="line"></span></code></pre></div></li><li><p><a href="http://stop.sh" target="_blank" rel="noreferrer">stop.sh</a></p><div class="language-shell"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki"><code><span class="line"><span style="color:#676E95;">#!/bin/sh</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">clear_iptables_rules</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">if</span><span style="color:#A6ACCD;"> /usr/sbin/iptables -L -n -t nat </span><span style="color:#89DDFF;">|</span><span style="color:#A6ACCD;"> grep -lq CLASH</span><span style="color:#89DDFF;">;</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">then</span></span>
<span class="line"><span style="color:#A6ACCD;">    /usr/sbin/iptables -t nat -D PREROUTING -p tcp --dport 22 -j ACCEPT</span></span>
<span class="line"><span style="color:#A6ACCD;">    /usr/sbin/iptables -t nat -D PREROUTING -j CLASH</span></span>
<span class="line"><span style="color:#A6ACCD;">    /usr/sbin/iptables -t nat -F CLASH</span></span>
<span class="line"><span style="color:#A6ACCD;">    /usr/sbin/iptables -t nat -X CLASH</span></span>
<span class="line"><span style="color:#A6ACCD;">    /usr/sbin/iptables -t nat -D PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053</span></span>
<span class="line"><span style="color:#A6ACCD;">  </span><span style="color:#89DDFF;">fi</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#82AAFF;">stop_clash</span><span style="color:#89DDFF;">()</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">{</span></span>
<span class="line"><span style="color:#A6ACCD;">  killall clash</span></span>
<span class="line"><span style="color:#89DDFF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#A6ACCD;">clear_iptables_rules</span></span>
<span class="line"><span style="color:#A6ACCD;">stop_clash</span></span>
<span class="line"></span></code></pre></div></li></ol><h2 id="访问控制界面" tabindex="-1">访问控制界面 <a class="header-anchor" href="#访问控制界面" aria-hidden="true">#</a></h2><ol><li><p>执行<code>sh start.sh</code></p></li><li><p>访问<a href="http://192.168.50.1:9090/ui/#/proxies" target="_blank" rel="noreferrer">192.168.50.1:9090 - yacd</a></p></li></ol>`,8),t=[e];function o(r,c,i,A,h,D){return n(),a("div",null,t)}const d=s(p,[["render",o]]);export{y as __pageData,d as default};
