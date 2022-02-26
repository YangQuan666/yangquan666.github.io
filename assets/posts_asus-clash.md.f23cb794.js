import{_ as a,c as s,o as n,a as t}from"./app.6a12c562.js";const b='{"title":"\u534E\u7855RT-AX56U V2\u8DEF\u7531\u5668\u5B89\u88C5clash","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5F00\u542FSSH","slug":"\u5F00\u542Fssh"},{"level":2,"title":"\u914D\u7F6E\u542F\u52A8\u548C\u5173\u95ED\u811A\u672C","slug":"\u914D\u7F6E\u542F\u52A8\u548C\u5173\u95ED\u811A\u672C"},{"level":2,"title":"\u8BBF\u95EE\u63A7\u5236\u754C\u9762","slug":"\u8BBF\u95EE\u63A7\u5236\u754C\u9762"}],"relativePath":"posts/asus-clash.md","lastUpdated":1645885950894}',e={},p=t(`<h1 id="\u534E\u7855rt-ax56u-v2\u8DEF\u7531\u5668\u5B89\u88C5clash" tabindex="-1">\u534E\u7855RT-AX56U V2\u8DEF\u7531\u5668\u5B89\u88C5clash <a class="header-anchor" href="#\u534E\u7855rt-ax56u-v2\u8DEF\u7531\u5668\u5B89\u88C5clash" aria-hidden="true">#</a></h1><ol><li><p>\u53C2\u8003\u9879\u76EE\uFF1A<a href="https://github.com/iloahz/asus-router-stock-firmware-clash" target="_blank" rel="noopener noreferrer">iloahz/asus-router-stock-firmware-clash</a></p></li><li><p>clash\u5730\u5740\uFF08armv7\uFF09\uFF1A<a href="https://github.com/Dreamacro/clash" target="_blank" rel="noopener noreferrer">Dreamacro/clash: A rule-based tunnel in Go. (github.com)</a></p></li><li><p>web\u754C\u9762\uFF1A<a href="https://github.com/haishanh/yacd" target="_blank" rel="noopener noreferrer">haishanh/yacd: Yet Another Clash Dashboard (github.com)</a></p></li></ol><h2 id="\u5F00\u542Fssh" tabindex="-1">\u5F00\u542FSSH <a class="header-anchor" href="#\u5F00\u542Fssh" aria-hidden="true">#</a></h2><ol><li><p>\u767B\u5F55\u8DEF\u7531\u5668\u540E\u53F0 &gt; \u7CFB\u7EDF\u7BA1\u7406 &gt; \u7CFB\u7EDF\u8BBE\u7F6E</p></li><li><p>ssh\u547D\u4EE4\u767B\u5F55\u8DEF\u7531\u5668\uFF1A<code>ssh {username}@192.168.50.1</code></p></li></ol><h2 id="\u914D\u7F6E\u542F\u52A8\u548C\u5173\u95ED\u811A\u672C" tabindex="-1">\u914D\u7F6E\u542F\u52A8\u548C\u5173\u95ED\u811A\u672C <a class="header-anchor" href="#\u914D\u7F6E\u542F\u52A8\u548C\u5173\u95ED\u811A\u672C" aria-hidden="true">#</a></h2><ol><li><p><a href="http://start.sh" target="_blank" rel="noopener noreferrer">start.sh</a></p><div class="language-shell"><pre><code><span class="token shebang important">#!/bin/sh</span>

<span class="token function-name function">create_iptables_rules</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token operator">!</span> /usr/sbin/iptables -L -n -t nat <span class="token operator">|</span> <span class="token function">grep</span> -lq CLASH<span class="token punctuation">;</span> <span class="token keyword">then</span>
        /usr/sbin/iptables -t nat -A PREROUTING -p tcp --dport <span class="token number">22</span> -j ACCEPT
        /usr/sbin/iptables -t nat -N CLASH
        /usr/sbin/iptables -t nat -A CLASH -p tcp --dport <span class="token number">7890</span> -j RETURN
        /usr/sbin/iptables -t nat -A CLASH -d <span class="token number">192.168</span>.0.0/16 -j RETURN
        /usr/sbin/iptables -t nat -A CLASH -p tcp -j REDIRECT --to-ports <span class="token number">7892</span>
        /usr/sbin/iptables -t nat -A PREROUTING -j CLASH
        /usr/sbin/iptables -t nat -A PREROUTING -p udp -m udp --dport <span class="token number">53</span> -j DNAT --to-destination <span class="token number">192.168</span>.50.1:1053
    <span class="token keyword">fi</span>
<span class="token punctuation">}</span>

<span class="token assign-left variable">clashdir</span><span class="token operator">=</span>/jffs/clash
<span class="token function-name function">start_clash</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">killall</span> clash
    <span class="token function">nohup</span> <span class="token variable">$clashdir</span>/clash -d <span class="token variable">$clashdir</span> -f <span class="token variable">$clashdir</span>/config.yaml <span class="token operator">&gt;</span> nohup.out <span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span><span class="token file-descriptor important">&amp;1</span> <span class="token operator">&amp;</span>
<span class="token punctuation">}</span>

create_iptables_rules
start_clash
</code></pre></div></li><li><p><a href="http://stop.sh" target="_blank" rel="noopener noreferrer">stop.sh</a></p><div class="language-shell"><pre><code><span class="token shebang important">#!/bin/sh</span>

<span class="token function-name function">clear_iptables_rules</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> /usr/sbin/iptables -L -n -t nat <span class="token operator">|</span> <span class="token function">grep</span> -lq CLASH<span class="token punctuation">;</span> <span class="token keyword">then</span>
    /usr/sbin/iptables -t nat -D PREROUTING -p tcp --dport <span class="token number">22</span> -j ACCEPT
    /usr/sbin/iptables -t nat -D PREROUTING -j CLASH
    /usr/sbin/iptables -t nat -F CLASH
    /usr/sbin/iptables -t nat -X CLASH
    /usr/sbin/iptables -t nat -D PREROUTING -p udp -m udp --dport <span class="token number">53</span> -j DNAT --to-destination <span class="token number">192.168</span>.50.1:1053
  <span class="token keyword">fi</span>
<span class="token punctuation">}</span>

<span class="token function-name function">stop_clash</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">killall</span> clash
<span class="token punctuation">}</span>

clear_iptables_rules
stop_clash
</code></pre></div></li></ol><h2 id="\u8BBF\u95EE\u63A7\u5236\u754C\u9762" tabindex="-1">\u8BBF\u95EE\u63A7\u5236\u754C\u9762 <a class="header-anchor" href="#\u8BBF\u95EE\u63A7\u5236\u754C\u9762" aria-hidden="true">#</a></h2><ol><li><p>\u6267\u884C<code>sh start.sh</code></p></li><li><p>\u8BBF\u95EE<a href="http://192.168.50.1:9090/ui/#/proxies" target="_blank" rel="noopener noreferrer">192.168.50.1:9090 - yacd</a></p></li></ol>`,8),o=[p];function l(r,c,i,u,h,d){return n(),s("div",null,o)}var f=a(e,[["render",l]]);export{b as __pageData,f as default};
