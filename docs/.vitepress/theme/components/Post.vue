<template>
  <q-parallax :height="300">
    <template v-slot:media>
      <img src="/default.svg" alt="background">
    </template>

    <template v-slot:content="scope">
      <div class="absolute column items-center">
        <h2>“Talk is cheap. Show me the code.”</h2>
      </div>
    </template>
  </q-parallax>

  <div class="row animate__animated animate__fadeIn">
    <!--todo 1.展示相关的标签，2.展示阅读需要的大概时间(根据字数估计)-->
    <Content class="markdown-body col-12 col-sm-10 offset-sm-1"/>
  </div>
  <q-drawer
      show-if-above
      no-swipe-open
      no-swipe-close
      side="right"
      bordered>
    <Toc :data="page.headers"/>
  </q-drawer>

</template>
<script lang="ts" setup>
import {useData} from "vitepress";
import Toc from "./Toc.vue";

const {page} = useData()

//todo 搜索引擎优化
// const metaData = {}
// useMeta(metaData)
</script>