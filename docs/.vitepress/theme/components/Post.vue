<template>
  <q-img src="/default.svg" height="400px" alt="background">
    <h3 class="absolute-full flex flex-center">
      Talk is cheap. Show me the code.
    </h3>
  </q-img>
  <div class="row animate__animated animate__fadeIn">
    <div class="col-12 col-sm-10 offset-sm-1">

      <q-card-actions>
        <q-icon name="schedule"/>
        预计阅读{{ readTime }}分钟
        <q-space/>
        <q-icon name="publish"/>
        {{ date.formatDate(frontmatter.date, 'YYYY-MM-DD') }}发表
      </q-card-actions>

      <Content ref="content" v-scroll="throttleOnScroll" class="markdown-body"/>
      <q-separator/>

      <q-card-actions>
        <q-btn flat color="blue-6" :href="site.themeConfig.sponsor.link">
          <div>请我喝杯咖啡</div>
          <q-icon right size="2em" :name="site.themeConfig.sponsor.icon"/>
        </q-btn>
        <q-space/>
        <q-btn flat color="teal" :href="site.themeConfig.comment.link">
          <q-icon left size="2em" :name="site.themeConfig.comment.icon"/>
          <div>给我留言</div>
        </q-btn>
      </q-card-actions>
    </div>
  </div>
  <Outline :headers="page.headers"/>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, onUpdated, ref} from 'vue';
import {useData} from 'vitepress';
import {throttleOnScroll, uniqueItemKey} from '../composables/outline';
import {isPost, readingTime} from '../composables/store';
import Outline from './Outline.vue';
import {date} from 'quasar';

const content = ref()
const {frontmatter, page, site} = useData()
const readTime = ref()

onMounted(() => {
  isPost.value = true
  readTime.value = readingTime(content.value.$el);
})

onUnmounted(() => {
  isPost.value = false
})

onUpdated(() => {
  uniqueItemKey.value = ''
})
//todo cookie 记录浏览位置
</script>