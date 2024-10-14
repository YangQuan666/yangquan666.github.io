<template>
  <v-img
      class="align-center justify-center"
      height="400px"
      src="/map.svg"
      cover
  >
    <div class="text-center text-h3">When in doubt, use brute force.</div>
  </v-img>
  <v-timeline align="center">
    <v-timeline-item
        v-for="({title, excerpt, time, link}, i) in summary"
        :key="i"
        dot-color="info"
        size="small"
    >
      <template v-slot:opposite>
        <div
            :class="`pt-1 headline font-weight-bold `"
            v-text="time"
        ></div>
      </template>
      <v-card variant="flat">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
          <p>{{ excerpt }}</p>
          <v-btn
              color="info"
              variant="plain"
              @click="router.go(link)"
          >
            阅读全文
          </v-btn>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>

</template>

<script setup>
import {useRouter} from 'vitepress'

const summary = [{
  "title": "从零开始写一个RPC框架",
  "link": "/post/rpc",
  "time": "2023-04-09",
  "excerpt": "本文基于netty和springboot实现了一个基础的RPC框架服务，提供寻址、自动注入、远程调用等功能"
}, {
  "title": "你真的了解消息队列吗",
  "link": "/post/message-queue",
  "time": "2022-11-11",
  "excerpt": "消息队列是一种高效的异步通信机制，能够在分布式系统中实现解耦、削峰填谷和可靠性等优势。我们将深入探讨消息队列的工作原理、应用场景以及常见的消息队列系统，为读者提供全面的了解和应用指导"
}, {
  "title": "几种常见的关键词匹配算法介绍",
  "link": "/post/keyword-check",
  "time": "2022-07-10",
  "excerpt": "本文介绍几种Java常见的关键词识别算法，包括暴力匹配、字典树和KMP。通过代码示例和详细解释，帮助读者深入理解和应用关键词识别算法在Java编程中的作用"
}, {
  "title": "关于Android刷机相关的，看这篇文章就够了",
  "link": "/post/android",
  "time": "2022-05-01",
  "excerpt": "本文探讨了Android刷机的基本概念和步骤，包括解锁引导程序、刷入自定义固件和恢复原厂系统等操作。通过详细的指导和注意事项，读者将了解如何安全地刷机、定制系统和解锁更多功能"
}, {
  "title": "面向小白的软路由入门指南",
  "link": "/post/openwrt",
  "time": "2022-04-30",
  "excerpt": "OpenWrt是一款开源的路由器操作系统，能够把你们的路由器变成一台强大的网络工具。它的灵活性和可扩展性让用户能够定制路由器的功能，让路由器发挥最大的潜力。"
}, {
  "title": "Java函数式编程入门",
  "link": "/post/java-stream",
  "time": "2020-09-01",
  "excerpt": "本文介绍了Java函数式编程的基础知识和入门要点，读者将了解函数式编程的核心概念：Lambda表达式的使用、函数接口和Stream API等关键技术。帮助读者初步掌握Java函数式编程的基本原理和应用，为进一步深入学习提供基础。"
}, {
  "title": "关于这个博客",
  "link": "/post/about",
  "time": "2020-05-01",
  "excerpt": "我为什么想自己做一个博客，以及我是怎么搭建起来这个博客网站的"
}]
const color = ['']
const router = useRouter()
</script>

<style scoped>

</style>