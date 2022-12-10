<template>
  <q-parallax :height="300">
    <template v-slot:media>
      <img src="https://cdn.quasar.dev/img/parallax2.jpg" alt="background">
    </template>

    <template v-slot:content="scope">
      <div class="absolute column items-center">
        <h2 class="text-white">
          “Talk is cheap. Show me the code.”
        </h2>
      </div>
    </template>
  </q-parallax>

  <q-markdown :src="mdStr">
  </q-markdown>
  <Content/>
</template>
<script setup>
import {useMeta} from 'quasar'
import {QMarkdown} from '@quasar/quasar-ui-qmarkdown'

const metaData = {

}
useMeta(metaData)

const mdStr = "# 华硕RT-AX56U V2路由器安装clash\n" +
    "\n" +
    "1. 参考项目：[iloahz/asus-router-stock-firmware-clash](https://github.com/iloahz/asus-router-stock-firmware-clash)\n" +
    "\n" +
    "2. clash地址（armv7）：[Dreamacro/clash: A rule-based tunnel in Go. (github.com)](https://github.com/Dreamacro/clash)\n" +
    "\n" +
    "3. web界面：[haishanh/yacd: Yet Another Clash Dashboard (github.com)](https://github.com/haishanh/yacd)\n" +
    "\n" +
    "## 开启SSH\n" +
    "\n" +
    "1. 登录路由器后台 > 系统管理 > 系统设置\n" +
    "\n" +
    "2. ssh命令登录路由器：`ssh {username}@192.168.50.1`\n" +
    "\n" +
    "## 配置启动和关闭脚本\n" +
    "\n" +
    "1. start.sh\n" +
    "   \n" +
    "   ```shell\n" +
    "   #!/bin/sh\n" +
    "   \n" +
    "   create_iptables_rules() {\n" +
    "       if ! /usr/sbin/iptables -L -n -t nat | grep -lq CLASH; then\n" +
    "           /usr/sbin/iptables -t nat -A PREROUTING -p tcp --dport 22 -j ACCEPT\n" +
    "           /usr/sbin/iptables -t nat -N CLASH\n" +
    "           /usr/sbin/iptables -t nat -A CLASH -p tcp --dport 7890 -j RETURN\n" +
    "           /usr/sbin/iptables -t nat -A CLASH -d 192.168.0.0/16 -j RETURN\n" +
    "           /usr/sbin/iptables -t nat -A CLASH -p tcp -j REDIRECT --to-ports 7892\n" +
    "           /usr/sbin/iptables -t nat -A PREROUTING -j CLASH\n" +
    "           /usr/sbin/iptables -t nat -A PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053\n" +
    "       fi\n" +
    "   }\n" +
    "   \n" +
    "   clashdir=/jffs/clash\n" +
    "   start_clash() {\n" +
    "       killall clash\n" +
    "       nohup $clashdir/clash -d $clashdir -f $clashdir/config.yaml > nohup.out 2>&1 &\n" +
    "   }\n" +
    "   \n" +
    "   create_iptables_rules\n" +
    "   start_clash\n" +
    "   ```\n" +
    "\n" +
    "2. stop.sh\n" +
    "   \n" +
    "   ```shell\n" +
    "   #!/bin/sh\n" +
    "   \n" +
    "   clear_iptables_rules() {\n" +
    "     if /usr/sbin/iptables -L -n -t nat | grep -lq CLASH; then\n" +
    "       /usr/sbin/iptables -t nat -D PREROUTING -p tcp --dport 22 -j ACCEPT\n" +
    "       /usr/sbin/iptables -t nat -D PREROUTING -j CLASH\n" +
    "       /usr/sbin/iptables -t nat -F CLASH\n" +
    "       /usr/sbin/iptables -t nat -X CLASH\n" +
    "       /usr/sbin/iptables -t nat -D PREROUTING -p udp -m udp --dport 53 -j DNAT --to-destination 192.168.50.1:1053\n" +
    "     fi\n" +
    "   }\n" +
    "   \n" +
    "   stop_clash() {\n" +
    "     killall clash\n" +
    "   }\n" +
    "   \n" +
    "   clear_iptables_rules\n" +
    "   stop_clash\n" +
    "   ```\n" +
    "\n" +
    "## 访问控制界面\n" +
    "\n" +
    "1. 执行`sh start.sh`\n" +
    "\n" +
    "2. 访问[192.168.50.1:9090 - yacd](http://192.168.50.1:9090/ui/#/proxies)\n"


</script>
<style src="@quasar/quasar-ui-qmarkdown/dist/index.css"></style>